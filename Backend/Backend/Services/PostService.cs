using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using System.Text.RegularExpressions;

namespace Backend.Services;

public interface IPostService
{
    Task<CursorPagedResult<PostResponseDto>> GetPostsAsync(CursorPaginationDto pagination);
    Task<CursorPagedResult<PostResponseDto>> GetPostsByUserAsync(int userId, CursorPaginationDto pagination);
    Task<PostResponseDto?> GetPostByIdAsync(int id);
    Task<PostResponseDto> CreatePostAsync(int userId, PostCreateDto dto);
    Task<PostResponseDto> UpdatePostAsync(int id, int userId, PostUpdateDto dto);
    Task<bool> DeletePostAsync(int id, int userId);
}

public class PostService : IPostService
{
    private readonly IPostRepository _postRepo;
    private readonly IHashtagRepository _hashtagRepo;

    public PostService(IPostRepository postRepo, IHashtagRepository hashtagRepo)
    {
        _postRepo = postRepo;
        _hashtagRepo = hashtagRepo;
    }

    public async Task<CursorPagedResult<PostResponseDto>> GetPostsAsync(CursorPaginationDto pagination)
    {
        var posts = await _postRepo.GetPostsWithPaginationAsync(pagination.Limit, pagination.CursorId);
        
        bool hasNextPage = posts.Count > pagination.Limit;
        if (hasNextPage)
        {
            posts.RemoveAt(pagination.Limit);
        }

        var nextCursor = posts.LastOrDefault()?.Id;

        var items = posts.Select(p => new PostResponseDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserFullName = p.User?.FullName ?? "Unknown",
            UserAvatarUrl = p.User?.AvatarUrl,
            Content = p.Content ?? string.Empty,
            ImageUrl = p.ImageUrl,
            CreatedAt = p.CreatedAt,
            LikeCount = p.Likes.Count,
            CommentCount = p.Comments.Count,
            Hashtags = p.Hashtags.Select(h => h.Name!).ToList()
        }).ToList();

        return new CursorPagedResult<PostResponseDto>
        {
            Items = items,
            HasNextPage = hasNextPage,
            NextCursorId = nextCursor
        };
    }

    public async Task<CursorPagedResult<PostResponseDto>> GetPostsByUserAsync(int userId, CursorPaginationDto pagination)
    {
        var posts = await _postRepo.GetPostsByUserIdWithPaginationAsync(userId, pagination.Limit, pagination.CursorId);
        
        bool hasNextPage = posts.Count > pagination.Limit;
        if (hasNextPage)
        {
            posts.RemoveAt(pagination.Limit);
        }

        var nextCursor = posts.LastOrDefault()?.Id;

        var items = posts.Select(p => new PostResponseDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserFullName = p.User?.FullName ?? "Unknown",
            UserAvatarUrl = p.User?.AvatarUrl,
            Content = p.Content ?? string.Empty,
            ImageUrl = p.ImageUrl,
            CreatedAt = p.CreatedAt,
            LikeCount = p.Likes.Count,
            CommentCount = p.Comments.Count,
            Hashtags = p.Hashtags.Select(h => h.Name!).ToList()
        }).ToList();

        return new CursorPagedResult<PostResponseDto>
        {
            Items = items,
            HasNextPage = hasNextPage,
            NextCursorId = nextCursor
        };
    }

    public async Task<PostResponseDto?> GetPostByIdAsync(int id)
    {
        var p = await _postRepo.GetPostWithDetailsAsync(id);
        if (p == null) return null;

        return new PostResponseDto
        {
            Id = p.Id,
            UserId = p.UserId,
            UserFullName = p.User?.FullName ?? "Unknown",
            UserAvatarUrl = p.User?.AvatarUrl,
            Content = p.Content ?? string.Empty,
            ImageUrl = p.ImageUrl,
            CreatedAt = p.CreatedAt,
            LikeCount = p.Likes.Count,
            CommentCount = p.Comments.Count,
            Hashtags = p.Hashtags.Select(h => h.Name!).ToList()
        };
    }

    public async Task<PostResponseDto> CreatePostAsync(int userId, PostCreateDto dto)
    {
        var post = new Post
        {
            UserId = userId,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        var hashtagMatches = Regex.Matches(dto.Content, @"#\w+");
        var hashtagNames = hashtagMatches.Select(m => m.Value).Distinct().ToList();

        if (hashtagNames.Any())
        {
            var existingHashtags = await _hashtagRepo.GetExistingHashtagsAsync(hashtagNames);

            foreach (var name in hashtagNames)
            {
                if (existingHashtags.TryGetValue(name, out var existing))
                {
                    post.Hashtags.Add(existing);
                }
                else
                {
                    var newHashtag = new Hashtag { Name = name };
                    await _hashtagRepo.AddAsync(newHashtag);
                    post.Hashtags.Add(newHashtag);
                }
            }
        }

        await _postRepo.AddAsync(post);
        await _postRepo.SaveChangesAsync(); // Lưu toàn bộ (cả Hashtag vì chung DbContext qua Scoped)

        return await GetPostByIdAsync(post.Id) ?? throw new Exception("Tạo bài viết thất bại!");
    }

    public async Task<PostResponseDto> UpdatePostAsync(int id, int userId, PostUpdateDto dto)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) throw new Exception("Bài viết không tồn tại.");
        if (post.UserId != userId) throw new UnauthorizedAccessException("Không có quyền chỉnh sửa bài viết này.");

        post.Content = dto.Content;
        post.ImageUrl = dto.ImageUrl;

        _postRepo.Update(post);
        await _postRepo.SaveChangesAsync();

        return await GetPostByIdAsync(post.Id) ?? throw new Exception("Cập nhật bài viết thất bại.");
    }

    public async Task<bool> DeletePostAsync(int id, int userId)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) return false;
        
        if (post.UserId != userId) return false;

        _postRepo.Remove(post);
        await _postRepo.SaveChangesAsync();
        return true;
    }
}
