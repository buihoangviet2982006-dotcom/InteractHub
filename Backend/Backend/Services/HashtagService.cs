using Backend.DTOs;
using Backend.Repositories;

namespace Backend.Services;

public interface IHashtagService
{
    Task<List<HashtagResponseDto>> GetTrendingHashtagsAsync(int limit);
}

public class HashtagService : IHashtagService
{
    private readonly IHashtagRepository _hashtagRepo;

    public HashtagService(IHashtagRepository hashtagRepo)
    {
        _hashtagRepo = hashtagRepo;
    }

    public async Task<List<HashtagResponseDto>> GetTrendingHashtagsAsync(int limit)
    {
        var hashtags = await _hashtagRepo.GetTrendingHashtagsAsync(limit);
        return hashtags.Select(h => new HashtagResponseDto
        {
            Id = h.Id,
            Name = h.Name!,
            PostCount = h.PostHashtags.Count
        }).ToList();
    }
}
