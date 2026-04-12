using System;

namespace Backend.Models;

public class Comment : Entity
{
    public int Id { get; set; }
    public string? Content { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PostId { get; set; }
    public virtual Post? Post { get; set; }

    public int UserId { get; set; } 
    public virtual User? User { get; set; }
}
