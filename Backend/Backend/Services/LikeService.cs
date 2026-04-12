using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public interface ILikeService
{
    Task<bool> ToggleLikeAsync(LikeToggleDto dto);
}

public class LikeService : ILikeService
{
    private readonly ILikeRepository _likeRepo;
    private readonly IPostRepository _postRepo;

    public LikeService(ILikeRepository likeRepo, IPostRepository postRepo)
    {
        _likeRepo = likeRepo;
        _postRepo = postRepo;
    }

    public async Task<bool> ToggleLikeAsync(LikeToggleDto dto)
    {
        var post = await _postRepo.GetByIdAsync(dto.PostId);
        if (post == null) throw new Exception("Bài viết không tồn tại.");

        var existingLike = await _likeRepo.GetLikeAsync(dto.PostId, dto.UserId);

        if (existingLike != null)
        {
            _likeRepo.Remove(existingLike);
            await _likeRepo.SaveChangesAsync();
            return false;
        }
        else
        {
            var like = new Like { PostId = dto.PostId, UserId = dto.UserId, CreatedAt = DateTime.UtcNow };
            await _likeRepo.AddAsync(like);
            await _likeRepo.SaveChangesAsync();
            return true;
        }
    }
}
