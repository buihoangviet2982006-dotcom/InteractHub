using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class FriendshipRepository : Repository<Friendship>, IFriendshipRepository
{
    public FriendshipRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Friendship?> GetFriendshipAsync(int userId1, int userId2)
    {
        return await _dbSet.FirstOrDefaultAsync(f => 
            (f.RequestorId == userId1 && f.ReceiverId == userId2) ||
            (f.RequestorId == userId2 && f.ReceiverId == userId1));
    }

    public async Task<List<Friendship>> GetFriendsByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(f => f.Requestor)
            .Include(f => f.Receiver)
            .Where(f => f.RequestorId == userId || f.ReceiverId == userId)
            .ToListAsync();
    }
}
