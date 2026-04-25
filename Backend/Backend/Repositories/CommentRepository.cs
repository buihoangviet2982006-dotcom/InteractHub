using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public interface ICommentRepository : IRepository<Comment>
{
    Task<List<Comment>> GetCommentsByPostIdAsync(int postId);
}

public class CommentRepository : Repository<Comment>, ICommentRepository
{
    public CommentRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Comment>> GetCommentsByPostIdAsync(int postId)
    {
        return await _dbSet
            .Where(c => c.PostId == postId)
            .Include(c => c.User)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }
}
