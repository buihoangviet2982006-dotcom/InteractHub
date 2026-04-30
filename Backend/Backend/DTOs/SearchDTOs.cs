namespace Backend.DTOs;

public class SearchResultDto
{
    public IEnumerable<UserDto> Users { get; set; } = new List<UserDto>();
    public IEnumerable<PostResponseDto> Posts { get; set; } = new List<PostResponseDto>();
}
