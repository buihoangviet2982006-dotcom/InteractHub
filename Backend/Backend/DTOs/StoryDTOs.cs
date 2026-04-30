using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class StoryCreateDto
{

    public byte[]? MediaData { get; set; }
    public string? Content { get; set; }
}

public class StoryResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public byte[]? UserAvatarData { get; set; }
    public byte[]? MediaData { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}
