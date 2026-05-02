using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class PostReportCreateDto
{

    [Required]
    public int PostId { get; set; }
    
    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;
}

public class PostReportResponseDto
{
    public int Id { get; set; }
    public int ReporterId { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public int PostId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Post Details for Admin UI
    public string PostContent { get; set; } = string.Empty;
    public byte[]? PostImageData { get; set; }
    public string PostAuthorName { get; set; } = string.Empty;
    public byte[]? PostAuthorAvatarData { get; set; }
}
