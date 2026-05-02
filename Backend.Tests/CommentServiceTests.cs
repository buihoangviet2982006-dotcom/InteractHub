using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class CommentServiceTests
{
    private readonly Mock<ICommentRepository> _commentRepoMock;
    private readonly Mock<IPostRepository> _postRepoMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly CommentService _commentService;

    public CommentServiceTests()
    {
        _commentRepoMock = new Mock<ICommentRepository>();
        _postRepoMock = new Mock<IPostRepository>();
        _userRepoMock = new Mock<IUserRepository>();
        _notificationServiceMock = new Mock<INotificationService>();

        _commentService = new CommentService(
            _commentRepoMock.Object,
            _postRepoMock.Object,
            _userRepoMock.Object,
            _notificationServiceMock.Object);
    }

    [Fact]
    public async Task CreateCommentAsync_ValidPost_ReturnsCommentDto()
    {
        // Arrange
        var userId = 1;
        var dto = new CommentCreateDto { PostId = 10, Content = "Great post!" };
        var post = new Post { Id = 10, UserId = 2 }; // Other user's post
        var user = new User { Id = userId, FullName = "Commenter" };

        _postRepoMock.Setup(r => r.GetByIdAsync(dto.PostId)).ReturnsAsync(post);
        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _commentService.CreateCommentAsync(userId, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Content, result.Content);
        _commentRepoMock.Verify(r => r.AddAsync(It.IsAny<Comment>()), Times.Once);
        _commentRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        _notificationServiceMock.Verify(n => n.SendNotificationAsync(post.UserId, "Comment", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task GetCommentsByPostAsync_ReturnsList()
    {
        // Arrange
        var postId = 10;
        var comments = new List<Comment> { new Comment { Content = "C1" }, new Comment { Content = "C2" } };
        _commentRepoMock.Setup(r => r.GetCommentsByPostIdAsync(postId)).ReturnsAsync(comments);

        // Act
        var result = await _commentService.GetCommentsByPostAsync(postId);

        // Assert
        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task DeleteCommentAsync_OwnComment_ReturnsTrue()
    {
        // Arrange
        var userId = 1;
        var commentId = 5;
        var comment = new Comment { Id = commentId, UserId = userId };
        _commentRepoMock.Setup(r => r.GetByIdAsync(commentId)).ReturnsAsync(comment);

        // Act
        var result = await _commentService.DeleteCommentAsync(commentId, userId);

        // Assert
        Assert.True(result);
        _commentRepoMock.Verify(r => r.Remove(comment), Times.Once);
        _commentRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
