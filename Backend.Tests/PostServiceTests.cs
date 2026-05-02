using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class PostServiceTests
{
    private readonly Mock<IPostRepository> _postRepoMock;
    private readonly Mock<IHashtagRepository> _hashtagRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly PostService _postService;

    public PostServiceTests()
    {
        _postRepoMock = new Mock<IPostRepository>();
        _hashtagRepoMock = new Mock<IHashtagRepository>();
        _notificationServiceMock = new Mock<INotificationService>();
        _userRepoMock = new Mock<IUserRepository>();

        _postService = new PostService(
            _postRepoMock.Object, 
            _hashtagRepoMock.Object, 
            _notificationServiceMock.Object, 
            _userRepoMock.Object);
    }

    [Fact]
    public async Task CreatePostAsync_ValidData_ReturnsPostResponseDto()
    {
        // Arrange
        var userId = 1;
        var dto = new PostCreateDto { Content = "Hello World #test" };
        var imageData = new byte[] { 0x1, 0x2 };
        var post = new Post { Id = 10, UserId = userId, Content = dto.Content, ImageData = imageData };

        _postRepoMock.Setup(r => r.AddAsync(It.IsAny<Post>()))
            .Callback<Post>(p => p.Id = 10)
            .Returns(Task.CompletedTask);
        
        _postRepoMock.Setup(r => r.GetPostWithDetailsAsync(10))
            .ReturnsAsync(post);

        _hashtagRepoMock.Setup(r => r.GetExistingHashtagsAsync(It.IsAny<List<string>>()))
            .ReturnsAsync(new Dictionary<string, Hashtag>());

        // Act
        var result = await _postService.CreatePostAsync(userId, dto, imageData);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(10, result.Id);
        Assert.Equal(dto.Content, result.Content);
        _postRepoMock.Verify(r => r.AddAsync(It.IsAny<Post>()), Times.Once);
        _postRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetPostByIdAsync_ExistingPost_ReturnsDto()
    {
        // Arrange
        var postId = 1;
        var post = new Post { Id = postId, Content = "Test content" };
        _postRepoMock.Setup(r => r.GetPostWithDetailsAsync(postId)).ReturnsAsync(post);

        // Act
        var result = await _postService.GetPostByIdAsync(postId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(postId, result.Id);
    }

    [Fact]
    public async Task GetPostByIdAsync_NonExistingPost_ReturnsNull()
    {
        // Arrange
        _postRepoMock.Setup(r => r.GetPostWithDetailsAsync(It.IsAny<int>())).ReturnsAsync((Post)null);

        // Act
        var result = await _postService.GetPostByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeletePostAsync_OwnPost_ReturnsTrue()
    {
        // Arrange
        var userId = 1;
        var postId = 10;
        var post = new Post { Id = postId, UserId = userId };

        _postRepoMock.Setup(r => r.GetByIdAsync(postId)).ReturnsAsync(post);

        // Act
        var result = await _postService.DeletePostAsync(postId, userId);

        // Assert
        Assert.True(result);
        _postRepoMock.Verify(r => r.Remove(post), Times.Once);
        _postRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeletePostAsync_NotOwnPost_ReturnsFalse()
    {
        // Arrange
        var userId = 1;
        var otherUserId = 2;
        var postId = 10;
        var post = new Post { Id = postId, UserId = otherUserId };

        _postRepoMock.Setup(r => r.GetByIdAsync(postId)).ReturnsAsync(post);

        // Act
        var result = await _postService.DeletePostAsync(postId, userId);

        // Assert
        Assert.False(result);
        _postRepoMock.Verify(r => r.Remove(It.IsAny<Post>()), Times.Never);
    }

    [Fact]
    public async Task UpdatePostAsync_ValidData_ReturnsUpdatedDto()
    {
        // Arrange
        var userId = 1;
        var postId = 10;
        var post = new Post { Id = postId, UserId = userId, Content = "Old content", Hashtags = new List<Hashtag>() };
        var dto = new PostUpdateDto { Content = "New content #updated" };

        _postRepoMock.Setup(r => r.GetPostWithHashtagsAsync(postId)).ReturnsAsync(post);
        _postRepoMock.Setup(r => r.GetPostWithDetailsAsync(postId)).ReturnsAsync(post);
        _hashtagRepoMock.Setup(r => r.GetExistingHashtagsAsync(It.IsAny<List<string>>()))
            .ReturnsAsync(new Dictionary<string, Hashtag>());

        // Act
        var result = await _postService.UpdatePostAsync(postId, userId, dto, null);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Content, result.Content);
        _postRepoMock.Verify(r => r.Update(post), Times.Once);
        _postRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
