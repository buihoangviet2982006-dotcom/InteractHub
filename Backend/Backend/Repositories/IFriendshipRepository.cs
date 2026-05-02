using Backend.Models;

namespace Backend.Repositories;

public interface IFriendshipRepository : IRepository<Friendship>
{
    Task<Friendship?> GetFriendshipAsync(int userId1, int userId2);
    Task<List<Friendship>> GetFriendsByUserIdAsync(int userId);
    Task<List<Friendship>> GetPendingRequestsByUserIdAsync(int userId);
    Task<List<Friendship>> GetSentRequestsByUserIdAsync(int userId);
}
