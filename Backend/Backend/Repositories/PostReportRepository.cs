using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class PostReportRepository : Repository<PostReport>, IPostReportRepository
{
    public PostReportRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<PostReport>> GetReportsWithPaginationAsync(int limit, int? cursorId)
    {
        var query = _dbSet
            .Include(r => r.Reporter)
            .Include(r => r.Post)
            .AsQueryable();

        if (cursorId.HasValue && cursorId > 0)
        {
            query = query.Where(r => r.Id < cursorId.Value);
        }

        return await query
            .OrderByDescending(r => r.Id)
            .Take(limit + 1)
            .ToListAsync();
    }
}
