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
            MediaData = dto.MediaData,
            Content = dto.Content,
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
            UserAvatarData = user.AvatarData,
            MediaData = story.MediaData,
            Content = story.Content,
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
            UserAvatarData = s.User?.AvatarData,
            MediaData = s.MediaData,
            Content = s.Content,
            CreatedAt = s.CreatedAt,
            ExpiresAt = s.ExpiresAt
        }).ToList();
    }
}
