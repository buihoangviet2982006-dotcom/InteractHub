using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

// Bạn hoàn toàn có thể đặt Interface và Class trong cùng một file để dễ quản lý
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> SearchUsersAsync(string query);
    Task<IEnumerable<User>> GetSuggestionsAsync(int currentUserId, int limit = 5);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> SearchUsersAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<User>();

        var lowerQuery = query.ToLower();
        return await _dbSet
            .Where(u => u.FullName.ToLower().Contains(lowerQuery) || u.Email.ToLower().Contains(lowerQuery))
            .Take(20)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetSuggestionsAsync(int currentUserId, int limit = 5)
    {
        // For simplicity, returning random users who are not the current user 
        // and ideally not already friends (we will filter friends in service or just assume random is fine for now, to avoid complex joins in this simple suggestion)
        // A better query would exclude existing friendships.
        var friendsIds = await _context.Set<Friendship>()
            .Where(f => f.RequestorId == currentUserId || f.ReceiverId == currentUserId)
            .Select(f => f.RequestorId == currentUserId ? f.ReceiverId : f.RequestorId)
            .ToListAsync();

        return await _dbSet
            .Where(u => u.Id != currentUserId && !friendsIds.Contains(u.Id))
            .OrderBy(r => Guid.NewGuid()) // Random order
            .Take(limit)
            .ToListAsync();
    }
}
