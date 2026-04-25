using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class PostReportService : IPostReportService
{
    private readonly IPostReportRepository _reportRepo;
    private readonly IPostRepository _postRepo;
    private readonly IUserRepository _userRepo;

    public PostReportService(IPostReportRepository reportRepo, IPostRepository postRepo, IUserRepository userRepo)
    {
        _reportRepo = reportRepo;
        _postRepo = postRepo;
        _userRepo = userRepo;
    }

    public async Task<PostReportResponseDto> CreateReportAsync(int reporterId, PostReportCreateDto dto)
    {
        var reporter = await _userRepo.GetByIdAsync(reporterId);
        var post = await _postRepo.GetByIdAsync(dto.PostId);

        if (reporter == null || post == null) 
            throw new Exception("Reporter or Post not found");

        var report = new PostReport
        {
            ReporterId = reporterId,
            PostId = dto.PostId,
            Reason = dto.Reason,
            CreatedAt = DateTime.UtcNow
        };

        await _reportRepo.AddAsync(report);
        await _reportRepo.SaveChangesAsync();

        return new PostReportResponseDto
        {
            Id = report.Id,
            ReporterId = report.ReporterId,
            ReporterName = reporter.FullName ?? string.Empty,
            PostId = report.PostId,
            Reason = report.Reason ?? string.Empty,
            CreatedAt = report.CreatedAt
        };
    }

    public async Task<CursorPagedResult<PostReportResponseDto>> GetReportsAsync(CursorPaginationDto pagination)
    {
        var reports = await _reportRepo.GetReportsWithPaginationAsync(pagination.Limit, pagination.CursorId);

        bool hasNextPage = reports.Count > pagination.Limit;
        if (hasNextPage)
        {
            reports.RemoveAt(pagination.Limit);
        }

        var nextCursor = reports.LastOrDefault()?.Id;

        var items = reports.Select(r => new PostReportResponseDto
        {
            Id = r.Id,
            ReporterId = r.ReporterId,
            ReporterName = r.Reporter?.FullName ?? string.Empty,
            PostId = r.PostId,
            Reason = r.Reason ?? string.Empty,
            CreatedAt = r.CreatedAt
        }).ToList();

        return new CursorPagedResult<PostReportResponseDto>
        {
            Items = items,
            HasNextPage = hasNextPage,
            NextCursorId = nextCursor
        };
    }
}
