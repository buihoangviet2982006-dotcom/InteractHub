using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public interface ILikeRepository : IRepository<Like>
{
    Task<Like?> GetLikeAsync(int postId, int userId);
}

public class LikeRepository : Repository<Like>, ILikeRepository
{
    public LikeRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Like?> GetLikeAsync(int postId, int userId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);
    }
}
