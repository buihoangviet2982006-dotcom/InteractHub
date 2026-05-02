using System;

namespace Backend.Models;
public class Story : Entity
{

    public byte[]? MediaData { get; set; }
    public string? Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(24);

    public int UserId { get; set; }
    public virtual User? User { get; set; }
}