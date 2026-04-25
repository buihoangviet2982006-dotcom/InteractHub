using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class StoryRepository : Repository<Story>, IStoryRepository
{
    public StoryRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Story>> GetActiveStoriesAsync()
    {
        return await _dbSet
            .Include(s => s.User)
            .Where(s => s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Story>> GetActiveStoriesByUserIdAsync(int userId)
    {
        return await _dbSet
            .Include(s => s.User)
            .Where(s => s.UserId == userId && s.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }
}
