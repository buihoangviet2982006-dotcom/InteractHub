using System;

namespace Backend.Entities;

public class Post
{
    public int PostId { get; set; }
    public string Content { get; set; } = default!;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Khóa ngoại liên kết tới User
    public string UserId { get; set; } = default!;
    public User User { get; set; } = default!;

    // 1 Post có nhiều like , comment , hashtag
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    public virtual ICollection<Hashtag> Hashtags { get; set; } = new List<Hashtag>();
}
