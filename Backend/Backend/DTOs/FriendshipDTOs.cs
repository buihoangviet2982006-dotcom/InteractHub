using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class FriendshipCreateDto
{

    [Required]
    public int ReceiverId { get; set; }
}

public class FriendshipResponseDto
{
    public int FriendId { get; set; }
    public string FriendName { get; set; } = string.Empty;
    public byte[]? FriendAvatarData { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
