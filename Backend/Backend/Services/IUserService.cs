using Backend.DTOs;

namespace Backend.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> SearchUsersAsync(string query);
    Task<IEnumerable<UserDto>> GetSuggestionsAsync(int currentUserId, int limit = 5);
    Task<UserProfileDto?> GetUserProfileAsync(int userId, int? currentUserId = null);
    Task UpdateAvatarAsync(int userId, byte[] avatarData);
    Task UpdateCoverAsync(int userId, byte[] coverData);
    Task<UserProfileDto> UpdateProfileAsync(int userId, UserUpdateDto dto);
    Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
}
