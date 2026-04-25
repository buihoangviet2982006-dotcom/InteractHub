using Backend.DTOs;

namespace Backend.Services;

public interface IPostReportService
{
    Task<PostReportResponseDto> CreateReportAsync(int reporterId, PostReportCreateDto dto);
    Task<CursorPagedResult<PostReportResponseDto>> GetReportsAsync(CursorPaginationDto pagination);
}
