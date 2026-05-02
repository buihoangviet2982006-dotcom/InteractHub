using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public interface IPostRepository : IRepository<Post>
{
    Task<List<Post>> GetPostsWithPaginationAsync(int limit, int? cursorId);
    Task<List<Post>> GetPostsByUserIdWithPaginationAsync(int userId, int limit, int? cursorId);
    Task<Post?> GetPostWithDetailsAsync(int id);
    Task<Post?> GetPostWithHashtagsAsync(int id);
    Task<List<Post>> SearchPostsAsync(string query, int limit = 20);
}

public class PostRepository : Repository<Post>, IPostRepository
{
    public PostRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Post>> GetPostsWithPaginationAsync(int limit, int? cursorId)
    {
        var query = _dbSet
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.Hashtags)
            .AsNoTracking()
            .OrderByDescending(p => p.Id)
            .AsQueryable();

        if (cursorId.HasValue)
        {
            query = query.Where(p => p.Id < cursorId.Value);
        }

        return await query.Take(limit + 1).ToListAsync();
    }

    public async Task<List<Post>> GetPostsByUserIdWithPaginationAsync(int userId, int limit, int? cursorId)
    {
        var query = _dbSet
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.Hashtags)
            .Where(p => p.UserId == userId)
            .AsNoTracking()
            .OrderByDescending(p => p.Id)
            .AsQueryable();

        if (cursorId.HasValue)
        {
            query = query.Where(p => p.Id < cursorId.Value);
        }

        return await query.Take(limit + 1).ToListAsync();
    }

    public async Task<Post?> GetPostWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.Hashtags)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Post?> GetPostWithHashtagsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Hashtags)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Post>> SearchPostsAsync(string query, int limit = 20)
    {
        var lowerQuery = query.ToLower();
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .Include(p => p.Hashtags)
            .Where(p => p.Content!.ToLower().Contains(lowerQuery) || 
                   p.Hashtags.Any(h => h.Name!.ToLower().Contains(lowerQuery)))
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }
}
