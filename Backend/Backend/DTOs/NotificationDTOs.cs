namespace Backend.DTOs;

public class NotificationResponseDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
