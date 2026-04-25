using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PostReportsController : ControllerBase
{
    private readonly IPostReportService _reportService;

    public PostReportsController(IPostReportService reportService)
    {
        _reportService = reportService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetReports([FromQuery] CursorPaginationDto pagination)
    {
        var result = await _reportService.GetReportsAsync(pagination);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReport([FromBody] PostReportCreateDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        try
        {
            var result = await _reportService.CreateReportAsync(userId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
