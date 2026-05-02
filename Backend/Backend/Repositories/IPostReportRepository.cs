using Backend.Models;

namespace Backend.Repositories;

public interface IPostReportRepository : IRepository<PostReport>
{
    Task<List<PostReport>> GetReportsWithPaginationAsync(int limit, int? cursorId);
}
