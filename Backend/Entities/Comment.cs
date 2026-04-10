using System;

namespace Backend.Entities;

public class Comment
{
    public int Id { get; set; }
    public string Content { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PostId { get; set; }
    public virtual Post? Post { get; set; }

    public string UserId { get; set; } = default!;
    public virtual User User { get; set; } = default!;
}
