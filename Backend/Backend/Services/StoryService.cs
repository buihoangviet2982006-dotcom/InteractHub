using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class StoryService : IStoryService
{
    private readonly IStoryRepository _storyRepo;
    private readonly IUserRepository _userRepo;

    public StoryService(IStoryRepository storyRepo, IUserRepository userRepo)
    {
        _storyRepo = storyRepo;
        _userRepo = userRepo;
    }

    public async Task<StoryResponseDto> CreateStoryAsync(int userId, StoryCreateDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null) throw new Exception("User not found");

        var story = new Story
        {
            UserId = userId,
            MediaUrl = dto.MediaUrl,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        await _storyRepo.AddAsync(story);
        await _storyRepo.SaveChangesAsync();

        return new StoryResponseDto
        {
            Id = story.Id,
            UserId = story.UserId,
            UserFullName = user.FullName ?? string.Empty,
            UserAvatarUrl = user.AvatarUrl,
            MediaUrl = story.MediaUrl,
            CreatedAt = story.CreatedAt,
            ExpiresAt = story.ExpiresAt
        };
    }

    public async Task<List<StoryResponseDto>> GetActiveStoriesAsync()
    {
        var stories = await _storyRepo.GetActiveStoriesAsync();
        return stories.Select(s => new StoryResponseDto
        {
            Id = s.Id,
            UserId = s.UserId,
            UserFullName = s.User?.FullName ?? string.Empty,
            UserAvatarUrl = s.User?.AvatarUrl,
            MediaUrl = s.MediaUrl,
            CreatedAt = s.CreatedAt,
            ExpiresAt = s.ExpiresAt
        }).ToList();
    }
}
