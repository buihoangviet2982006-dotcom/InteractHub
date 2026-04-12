using System;

namespace Backend.Models;
public class Post : Entity
{
    public int Id { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Khóa ngoại liên kết tới User
    public int UserId { get; set; }
    public User? User { get; set; }

    // 1 Post có nhiều like , comment , hashtag
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    public virtual ICollection<Hashtag> Hashtags { get; set; } = new List<Hashtag>();
    public virtual ICollection<PostReport> PostReports { get; set; } = new List<PostReport>();

}
