using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public interface ICommentService
{
    Task<List<CommentResponseDto>> GetCommentsByPostAsync(int postId);
    Task<CommentResponseDto> CreateCommentAsync(CommentCreateDto dto);
    Task<bool> DeleteCommentAsync(int id, int userId);
}

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepo;
    private readonly IPostRepository _postRepo;
    private readonly IUserRepository _userRepo;

    public CommentService(ICommentRepository commentRepo, IPostRepository postRepo, IUserRepository userRepo)
    {
        _commentRepo = commentRepo;
        _postRepo = postRepo;
        _userRepo = userRepo;
    }

    public async Task<List<CommentResponseDto>> GetCommentsByPostAsync(int postId)
    {
        var comments = await _commentRepo.GetCommentsByPostIdAsync(postId);
        return comments.Select(c => new CommentResponseDto
        {
            Id = c.Id,
            PostId = c.PostId,
            UserId = c.UserId,
            UserFullName = c.User?.FullName ?? "Unknown",
            UserAvatarUrl = c.User?.AvatarUrl,
            Content = c.Content!,
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<CommentResponseDto> CreateCommentAsync(CommentCreateDto dto)
    {
        var post = await _postRepo.GetByIdAsync(dto.PostId);
        if (post == null) throw new Exception("Bài viết không tồn tại.");

        var comment = new Comment
        {
            PostId = dto.PostId,
            UserId = dto.UserId,
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _commentRepo.AddAsync(comment);
        await _commentRepo.SaveChangesAsync();

        var user = await _userRepo.GetByIdAsync(dto.UserId);

        return new CommentResponseDto
        {
            Id = comment.Id,
            PostId = comment.PostId,
            UserId = comment.UserId,
            UserFullName = user?.FullName ?? "Unknown",
            UserAvatarUrl = user?.AvatarUrl,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<bool> DeleteCommentAsync(int id, int userId)
    {
        var comment = await _commentRepo.GetByIdAsync(id);
        if (comment == null) return false;
        
        if (comment.UserId != userId) return false;

        _commentRepo.Remove(comment);
        await _commentRepo.SaveChangesAsync();
        return true;
    }
}
