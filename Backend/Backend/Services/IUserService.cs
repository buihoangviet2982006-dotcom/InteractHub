using Backend.DTOs;
using Backend.Models;

namespace Backend.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> SearchUsersAsync(string query);
    Task<IEnumerable<UserDto>> GetSuggestionsAsync(int currentUserId, int limit = 5);
    Task<UserProfileDto?> GetUserProfileAsync(int userId, int? currentUserId = null);
    Task UpdateAvatarAsync(int userId, string avatarUrl);
    Task UpdateCoverAsync(int userId, string coverUrl);
}
