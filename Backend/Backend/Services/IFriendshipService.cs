using Backend.DTOs;

namespace Backend.Services;

public interface IFriendshipService
{
    Task<bool> SendFriendRequestAsync(int requestorId, FriendshipCreateDto dto);
    Task<bool> DeleteFriendshipAsync(int userId1, int userId2);
    Task<List<FriendshipResponseDto>> GetFriendsAsync(int userId);
    Task<bool> AcceptFriendRequestAsync(int userId, int requestorId);
    Task<bool> DeclineFriendRequestAsync(int userId, int requestorId);
    Task<List<FriendshipResponseDto>> GetPendingRequestsAsync(int userId);
}
