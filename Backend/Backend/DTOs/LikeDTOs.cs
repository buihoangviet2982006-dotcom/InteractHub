using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class LikeToggleDto
{
    [Required]
    public int PostId { get; set; }
    
    [Required]
    public int UserId { get; set; }
}
