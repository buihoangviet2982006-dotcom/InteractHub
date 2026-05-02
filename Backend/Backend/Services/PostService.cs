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
    Task<PostResponseDto> CreatePostAsync(int userId, PostCreateDto dto, byte[]? imageData);
    Task<PostResponseDto> UpdatePostAsync(int id, int userId, PostUpdateDto dto, byte[]? imageData);
    Task<bool> DeletePostAsync(int id, int userId);
    Task<bool> DeletePostAsAdminAsync(int id, int adminId);
    Task<bool> SharePostAsync(int id, int userId, int receiverId);
    Task<List<PostResponseDto>> SearchPostsAsync(string query);
}

public class PostService : IPostService
{
    private readonly IPostRepository _postRepo;
    private readonly IHashtagRepository _hashtagRepo;
    private readonly INotificationService _notificationService;
    private readonly IUserRepository _userRepo;

    public PostService(IPostRepository postRepo, IHashtagRepository hashtagRepo, INotificationService notificationService, IUserRepository userRepo)
    {
        _postRepo = postRepo;
        _hashtagRepo = hashtagRepo;
        _notificationService = notificationService;
        _userRepo = userRepo;
    }

    private static PostResponseDto MapToDto(Post p) => new()
    {
        Id = p.Id,
        UserId = p.UserId,
        UserFullName = p.User?.FullName ?? "Unknown",
        UserAvatarData = p.User?.AvatarData,
        Content = p.Content ?? string.Empty,
        ImageData = p.ImageData,
        CreatedAt = p.CreatedAt,
        LikeCount = p.Likes.Count,
        CommentCount = p.Comments.Count,
        Hashtags = p.Hashtags.Select(h => h.Name!).ToList()
    };

    public async Task<CursorPagedResult<PostResponseDto>> GetPostsAsync(CursorPaginationDto pagination)
    {
        var posts = await _postRepo.GetPostsWithPaginationAsync(pagination.Limit, pagination.CursorId);
        
        bool hasNextPage = posts.Count > pagination.Limit;
        if (hasNextPage) posts.RemoveAt(pagination.Limit);

        return new CursorPagedResult<PostResponseDto>
        {
            Items = posts.Select(MapToDto).ToList(),
            HasNextPage = hasNextPage,
            NextCursorId = posts.LastOrDefault()?.Id
        };
    }

    public async Task<CursorPagedResult<PostResponseDto>> GetPostsByUserAsync(int userId, CursorPaginationDto pagination)
    {
        var posts = await _postRepo.GetPostsByUserIdWithPaginationAsync(userId, pagination.Limit, pagination.CursorId);
        
        bool hasNextPage = posts.Count > pagination.Limit;
        if (hasNextPage) posts.RemoveAt(pagination.Limit);

        return new CursorPagedResult<PostResponseDto>
        {
            Items = posts.Select(MapToDto).ToList(),
            HasNextPage = hasNextPage,
            NextCursorId = posts.LastOrDefault()?.Id
        };
    }

    public async Task<PostResponseDto?> GetPostByIdAsync(int id)
    {
        var p = await _postRepo.GetPostWithDetailsAsync(id);
        return p == null ? null : MapToDto(p);
    }

    private async Task ProcessHashtagsAsync(Post post, string content)
    {
        var hashtagMatches = Regex.Matches(content, @"#\w+");
        var hashtagNames = hashtagMatches.Select(m => m.Value).Distinct().ToList();

        // Xóa các hashtag cũ (cho trường hợp Update)
        post.Hashtags.Clear();

        if (hashtagNames.Any())
        {
            var existingHashtags = await _hashtagRepo.GetExistingHashtagsAsync(hashtagNames);

            foreach (var name in hashtagNames)
            {
                if (existingHashtags.TryGetValue(name, out var existing))
                    post.Hashtags.Add(existing);
                else
                {
                    var newHashtag = new Hashtag { Name = name };
                    await _hashtagRepo.AddAsync(newHashtag);
                    post.Hashtags.Add(newHashtag);
                }
            }
        }
    }

    public async Task<PostResponseDto> CreatePostAsync(int userId, PostCreateDto dto, byte[]? imageData)
    {
        var post = new Post
        {
            UserId = userId,
            Content = dto.Content,
            ImageData = imageData,
            CreatedAt = DateTime.Now
        };

        await ProcessHashtagsAsync(post, dto.Content);

        await _postRepo.AddAsync(post);
        await _postRepo.SaveChangesAsync();

        return await GetPostByIdAsync(post.Id) ?? throw new Exception("Tạo bài viết thất bại!");
    }

    public async Task<PostResponseDto> UpdatePostAsync(int id, int userId, PostUpdateDto dto, byte[]? imageData)
    {
        var post = await _postRepo.GetPostWithHashtagsAsync(id);
        if (post == null) throw new Exception("Bài viết không tồn tại.");
        if (post.UserId != userId) throw new UnauthorizedAccessException("Không có quyền chỉnh sửa bài viết này.");

        post.Content = dto.Content;
        // Chỉ cập nhật ảnh nếu có file mới được gửi lên
        if (imageData != null)
            post.ImageData = imageData;

        await ProcessHashtagsAsync(post, dto.Content);

        _postRepo.Update(post);
        await _postRepo.SaveChangesAsync();

        return await GetPostByIdAsync(post.Id) ?? throw new Exception("Cập nhật bài viết thất bại.");
    }

    public async Task<bool> DeletePostAsync(int id, int userId)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null || post.UserId != userId) return false;

        _postRepo.Remove(post);
        await _postRepo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeletePostAsAdminAsync(int id, int adminId)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) return false;

        // Send notification to the author
        await _notificationService.SendNotificationAsync(post.UserId, "Warning", "Bài viết của bạn đã bị xóa do vi phạm quy định cộng đồng.");

        _postRepo.Remove(post);
        await _postRepo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> SharePostAsync(int id, int userId, int receiverId)
    {
        var post = await _postRepo.GetByIdAsync(id);
        if (post == null) return false;

        var user = await _userRepo.GetByIdAsync(userId);
        await _notificationService.SendNotificationAsync(receiverId, "Share", $"{user?.FullName ?? "Một người dùng"} đã chia sẻ một bài viết với bạn.");
        
        return true;
    }

    public async Task<List<PostResponseDto>> SearchPostsAsync(string query)
    {
        var posts = await _postRepo.SearchPostsAsync(query);
        return posts.Select(MapToDto).ToList();
    }
}
