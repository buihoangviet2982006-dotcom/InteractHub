using Backend.DTOs;
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
            FullName = u.FullName,
            Email = u.Email,
            AvatarUrl = u.AvatarUrl,
            CoverUrl = u.CoverUrl
        });
    }

    public async Task<IEnumerable<UserDto>> GetSuggestionsAsync(int currentUserId, int limit = 5)
    {
        var users = await _userRepository.GetSuggestionsAsync(currentUserId, limit);
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            AvatarUrl = u.AvatarUrl,
            CoverUrl = u.CoverUrl
        });
    }

    public async Task<UserProfileDto?> GetUserProfileAsync(int userId, int? currentUserId = null)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        var friends = await _friendshipRepository.GetFriendsByUserIdAsync(userId);
        
        bool isFriend = false;
        if (currentUserId.HasValue && currentUserId.Value != userId)
        {
            var friendship = await _friendshipRepository.GetFriendshipAsync(currentUserId.Value, userId);
            isFriend = friendship != null;
        }

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            CoverUrl = user.CoverUrl,
            FriendCount = friends.Count,
            IsFriend = isFriend,
            RequestSent = false // We can implement request sent tracking if needed, but for now we skip or leave false.
        };
    }

    public async Task UpdateAvatarAsync(int userId, string avatarUrl)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.AvatarUrl = avatarUrl;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }

    public async Task UpdateCoverAsync(int userId, string coverUrl)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.CoverUrl = coverUrl;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}
