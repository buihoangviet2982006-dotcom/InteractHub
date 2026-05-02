using System;

namespace Backend.Models;
public class PostReport : Entity
{

    public string? Reason { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int PostId { get; set; }
    public virtual Post? Post { get; set; }

    public int ReporterId { get; set; }
    public virtual User? Reporter { get; set; }
}