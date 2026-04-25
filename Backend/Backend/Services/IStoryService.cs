using Backend.DTOs;

namespace Backend.Services;

public interface IStoryService
{
    Task<StoryResponseDto> CreateStoryAsync(int userId, StoryCreateDto dto);
    Task<List<StoryResponseDto>> GetActiveStoriesAsync();
}
