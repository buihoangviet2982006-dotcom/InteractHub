using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class StoryServiceTests
{
    private readonly Mock<IStoryRepository> _storyRepoMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly StoryService _storyService;

    public StoryServiceTests()
    {
        _storyRepoMock = new Mock<IStoryRepository>();
        _userRepoMock = new Mock<IUserRepository>();
        _storyService = new StoryService(_storyRepoMock.Object, _userRepoMock.Object);
    }

    [Fact]
    public async Task CreateStoryAsync_ValidUser_ReturnsDto()
    {
        // Arrange
        var userId = 1;
        var dto = new StoryCreateDto { Content = "My Story" };
        var user = new User { Id = userId, FullName = "User One" };

        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        var result = await _storyService.CreateStoryAsync(userId, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Content, result.Content);
        _storyRepoMock.Verify(r => r.AddAsync(It.IsAny<Story>()), Times.Once);
        _storyRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetActiveStoriesAsync_ReturnsList()
    {
        // Arrange
        var stories = new List<Story> { new Story(), new Story() };
        _storyRepoMock.Setup(r => r.GetActiveStoriesAsync()).ReturnsAsync(stories);

        // Act
        var result = await _storyService.GetActiveStoriesAsync();

        // Assert
        Assert.Equal(2, result.Count);
    }
}
