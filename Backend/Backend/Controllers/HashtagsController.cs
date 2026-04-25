using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HashtagsController : ControllerBase
{
    private readonly IHashtagService _hashtagService;

    public HashtagsController(IHashtagService hashtagService)
    {
        _hashtagService = hashtagService;
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] int limit = 10)
    {
        var hashtags = await _hashtagService.GetTrendingHashtagsAsync(limit);
        return Ok(hashtags);
    }
}
