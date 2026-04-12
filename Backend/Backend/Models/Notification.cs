using System;

namespace Backend.Models;
public class Notification : Entity
{

    public string? Content { get; set; }
    public string? Type { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; } 
    public virtual User? User { get; set; }
}