using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class PostCreateDto
{
    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}

public class PostUpdateDto
{
    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
}

public class PostResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public byte[]? UserAvatarData { get; set; }
    public string Content { get; set; } = string.Empty;
    public byte[]? ImageData { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public List<string> Hashtags { get; set; } = new();
}
