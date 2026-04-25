using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public interface ILikeService
{
    Task<bool> ToggleLikeAsync(int userId, LikeToggleDto dto);
}

public class LikeService : ILikeService
{
    private readonly ILikeRepository _likeRepo;
    private readonly IPostRepository _postRepo;
    private readonly INotificationService _notificationService;

    public LikeService(ILikeRepository likeRepo, IPostRepository postRepo, INotificationService notificationService)
    {
        _likeRepo = likeRepo;
        _postRepo = postRepo;
        _notificationService = notificationService;
    }

    public async Task<bool> ToggleLikeAsync(int userId, LikeToggleDto dto)
    {
        var post = await _postRepo.GetByIdAsync(dto.PostId);
        if (post == null) throw new Exception("Bài viết không tồn tại.");

        var existingLike = await _likeRepo.GetLikeAsync(dto.PostId, userId);

        if (existingLike != null)
        {
            _likeRepo.Remove(existingLike);
            await _likeRepo.SaveChangesAsync();
            return false;
        }
        else
        {
            var like = new Like { PostId = dto.PostId, UserId = userId, CreatedAt = DateTime.UtcNow };
            await _likeRepo.AddAsync(like);
            await _likeRepo.SaveChangesAsync();
            
            if (post.UserId != userId)
            {
                await _notificationService.SendNotificationAsync(post.UserId, "Like", "Một người dùng đã thích bài viết của bạn.");
            }

            return true;
        }
    }
}
