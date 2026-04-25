
namespace Backend.Models;
public class User : Entity
{

    public string? Email{get;set;}
    public string? PasswordHash{get;set;}
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public string Role { get; set; } = "User";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // --- Quan hệ với các bảng khác (Navigation Properties) ---
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Like> Likes { get; set; } = new List<Like>();
    public virtual ICollection<Story> Stories { get; set; } = new List<Story>();
    
    // Đã sửa lại đúng chính tả từ "Nofication" thành "Notification" nếu bạn đổi tên file
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<Friendship> SentRequests { get; set; } = new List<Friendship>();
    public virtual ICollection<Friendship> ReceivedRequests { get; set; } = new List<Friendship>();
}