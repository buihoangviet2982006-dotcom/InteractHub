using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class FriendshipsController : ControllerBase
{
    private readonly IFriendshipService _friendshipService;

    public FriendshipsController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpPost("request")]
    public async Task<IActionResult> SendRequest([FromBody] FriendshipCreateDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _friendshipService.SendFriendRequestAsync(userId, dto);
        if (!success) return BadRequest("Unable to send friend request. User may not exist or friendship already exists.");

        return Ok("Friend request sent/accepted successfully.");
    }

    [HttpDelete("{targetUserId}")]
    public async Task<IActionResult> DeleteFriendship(int targetUserId)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _friendshipService.DeleteFriendshipAsync(userId, targetUserId);
        if (!success) return NotFound("Friendship not found.");

        return NoContent();
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetFriends(int userId)
    {
        var friends = await _friendshipService.GetFriendsAsync(userId);
        return Ok(friends);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingRequests()
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var requests = await _friendshipService.GetPendingRequestsAsync(userId);
        return Ok(requests);
    }

    [HttpPost("accept/{requestorId}")]
    public async Task<IActionResult> AcceptRequest(int requestorId)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _friendshipService.AcceptFriendRequestAsync(userId, requestorId);
        if (!success) return BadRequest("Unable to accept friend request.");

        return Ok("Friend request accepted.");
    }

    [HttpPost("decline/{requestorId}")]
    public async Task<IActionResult> DeclineRequest(int requestorId)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _friendshipService.DeclineFriendRequestAsync(userId, requestorId);
        if (!success) return BadRequest("Unable to decline friend request.");

        return Ok("Friend request declined.");
    }
}
