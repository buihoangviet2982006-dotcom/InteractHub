namespace Backend.DTOs;

public class HashtagResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int PostCount { get; set; } // Sẽ đếm số lượng bài viết chứa Hashtag này
}
