using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public UserService(IUserRepository userRepository, IFriendshipRepository friendshipRepository)
    {
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<IEnumerable<UserDto>> SearchUsersAsync(string query)
    {
        var users = await _userRepository.SearchUsersAsync(query);
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName!,
            Email = u.Email!,
            Bio = u.Bio,
            AvatarData = u.AvatarData,
            CoverData = u.CoverData
        });
    }

    public async Task<IEnumerable<UserDto>> GetSuggestionsAsync(int currentUserId, int limit = 5)
    {
        var users = await _userRepository.GetSuggestionsAsync(currentUserId, limit);
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName!,
            Email = u.Email!,
            Bio = u.Bio,
            AvatarData = u.AvatarData,
            CoverData = u.CoverData
        });
    }

    public async Task<UserProfileDto?> GetUserProfileAsync(int userId, int? currentUserId = null)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        var friends = await _friendshipRepository.GetFriendsByUserIdAsync(userId);
        
        bool isFriend = false;
        bool requestSent = false;

        if (currentUserId.HasValue && currentUserId.Value != userId)
        {
            var friendship = await _friendshipRepository.GetFriendshipAsync(currentUserId.Value, userId);
            if (friendship != null)
            {
                isFriend = friendship.Status == FriendshipStatus.Accepted;
                requestSent = friendship.Status == FriendshipStatus.Pending && friendship.RequestorId == currentUserId.Value;
            }
        }

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName!,
            Email = user.Email!,
            Bio = user.Bio,
            AvatarData = user.AvatarData,
            CoverData = user.CoverData,
            FriendCount = friends.Count,
            IsFriend = isFriend,
            RequestSent = requestSent
        };
    }

    public async Task UpdateAvatarAsync(int userId, byte[] avatarData)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.AvatarData = avatarData;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }

    public async Task UpdateCoverAsync(int userId, byte[] coverData)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.CoverData = coverData;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }

    public async Task<UserProfileDto> UpdateProfileAsync(int userId, UserUpdateDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        // Check if email is being changed and if it's already in use
        if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase))
        {
            var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email đã được sử dụng.");
            }
            user.Email = dto.Email;
        }

        user.FullName = dto.FullName;
        user.Bio = dto.Bio;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return await GetUserProfileAsync(userId, userId) ?? throw new Exception("Error reloading profile");
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash))
        {
            throw new Exception("Incorrect old password.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
    }
}
