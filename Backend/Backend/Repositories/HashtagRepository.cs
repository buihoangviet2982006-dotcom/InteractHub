using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public interface IHashtagRepository : IRepository<Hashtag>
{
    Task<Dictionary<string, Hashtag>> GetExistingHashtagsAsync(List<string> names);
    Task<List<Hashtag>> GetTrendingHashtagsAsync(int limit);
}

public class HashtagRepository : Repository<Hashtag>, IHashtagRepository
{
    public HashtagRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Dictionary<string, Hashtag>> GetExistingHashtagsAsync(List<string> names)
    {
        return await _dbSet
            .Where(h => names.Contains(h.Name!))
            .ToDictionaryAsync(h => h.Name!);
    }

    public async Task<List<Hashtag>> GetTrendingHashtagsAsync(int limit)
    {
        return await _dbSet
            .Include(h => h.PostHashtags)
            .OrderByDescending(h => h.PostHashtags.Count)
            .Take(limit)
            .ToListAsync();
    }
}
