using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class LikeServiceTests
{
    private readonly Mock<ILikeRepository> _likeRepoMock;
    private readonly Mock<IPostRepository> _postRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly LikeService _likeService;

    public LikeServiceTests()
    {
        _likeRepoMock = new Mock<ILikeRepository>();
        _postRepoMock = new Mock<IPostRepository>();
        _notificationServiceMock = new Mock<INotificationService>();

        _likeService = new LikeService(_likeRepoMock.Object, _postRepoMock.Object, _notificationServiceMock.Object);
    }

    [Fact]
    public async Task ToggleLikeAsync_WhenNotLiked_AddsLike()
    {
        // Arrange
        var userId = 1;
        var dto = new LikeToggleDto { PostId = 10 };
        var post = new Post { Id = 10, UserId = 2 };

        _postRepoMock.Setup(r => r.GetByIdAsync(dto.PostId)).ReturnsAsync(post);
        _likeRepoMock.Setup(r => r.GetLikeAsync(dto.PostId, userId)).ReturnsAsync((Like)null);

        // Act
        var result = await _likeService.ToggleLikeAsync(userId, dto);

        // Assert
        Assert.True(result); // Liked
        _likeRepoMock.Verify(r => r.AddAsync(It.IsAny<Like>()), Times.Once);
        _notificationServiceMock.Verify(n => n.SendNotificationAsync(post.UserId, "Like", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task ToggleLikeAsync_WhenAlreadyLiked_RemovesLike()
    {
        // Arrange
        var userId = 1;
        var dto = new LikeToggleDto { PostId = 10 };
        var post = new Post { Id = 10, UserId = 2 };
        var existingLike = new Like();

        _postRepoMock.Setup(r => r.GetByIdAsync(dto.PostId)).ReturnsAsync(post);
        _likeRepoMock.Setup(r => r.GetLikeAsync(dto.PostId, userId)).ReturnsAsync(existingLike);

        // Act
        var result = await _likeService.ToggleLikeAsync(userId, dto);

        // Assert
        Assert.False(result); // Unliked
        _likeRepoMock.Verify(r => r.Remove(existingLike), Times.Once);
    }
}
