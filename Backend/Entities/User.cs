using Microsoft.AspNetCore.Identity;

namespace Backend.Entities;

public class User : IdentityUser 
{
    public int UserId{get;set;}
    public string FullName { get; set; } = default!;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Quan hệ: Một User có nhiều Post
    public virtual ICollection<Post> Posts { get; set; } = default!;
}