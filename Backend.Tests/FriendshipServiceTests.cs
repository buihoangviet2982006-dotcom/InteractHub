using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class FriendshipServiceTests
{
    private readonly Mock<IFriendshipRepository> _friendshipRepoMock;
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly Mock<INotificationService> _notificationServiceMock;
    private readonly FriendshipService _friendshipService;

    public FriendshipServiceTests()
    {
        _friendshipRepoMock = new Mock<IFriendshipRepository>();
        _userRepoMock = new Mock<IUserRepository>();
        _notificationServiceMock = new Mock<INotificationService>();
        _friendshipService = new FriendshipService(_friendshipRepoMock.Object, _userRepoMock.Object, _notificationServiceMock.Object);
    }

    [Fact]
    public async Task SendFriendRequestAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        var requestorId = 1;
        var dto = new FriendshipCreateDto { ReceiverId = 2 };
        var requestor = new User { Id = requestorId, FullName = "Requestor" };
        var receiver = new User { Id = dto.ReceiverId, FullName = "Receiver" };

        _userRepoMock.Setup(r => r.GetByIdAsync(requestorId)).ReturnsAsync(requestor);
        _userRepoMock.Setup(r => r.GetByIdAsync(dto.ReceiverId)).ReturnsAsync(receiver);
        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(requestorId, dto.ReceiverId)).ReturnsAsync((Friendship)null);

        // Act
        var result = await _friendshipService.SendFriendRequestAsync(requestorId, dto);

        // Assert
        Assert.True(result);
        _friendshipRepoMock.Verify(r => r.AddAsync(It.IsAny<Friendship>()), Times.Once);
        _friendshipRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        _notificationServiceMock.Verify(n => n.SendNotificationAsync(dto.ReceiverId, "FriendRequest", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task SendFriendRequestAsync_ToSelf_ReturnsFalse()
    {
        // Arrange
        var requestorId = 1;
        var dto = new FriendshipCreateDto { ReceiverId = 1 };

        // Act
        var result = await _friendshipService.SendFriendRequestAsync(requestorId, dto);

        // Assert
        Assert.False(result);
        _friendshipRepoMock.Verify(r => r.AddAsync(It.IsAny<Friendship>()), Times.Never);
    }

    [Fact]
    public async Task SendFriendRequestAsync_AlreadyFriends_ReturnsFalse()
    {
        // Arrange
        var requestorId = 1;
        var dto = new FriendshipCreateDto { ReceiverId = 2 };
        var requestor = new User { Id = requestorId };
        var receiver = new User { Id = dto.ReceiverId };
        var existingFriendship = new Friendship { Status = FriendshipStatus.Accepted };

        _userRepoMock.Setup(r => r.GetByIdAsync(requestorId)).ReturnsAsync(requestor);
        _userRepoMock.Setup(r => r.GetByIdAsync(dto.ReceiverId)).ReturnsAsync(receiver);
        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(requestorId, dto.ReceiverId)).ReturnsAsync(existingFriendship);

        // Act
        var result = await _friendshipService.SendFriendRequestAsync(requestorId, dto);

        // Assert
        Assert.False(result);
        _friendshipRepoMock.Verify(r => r.Update(It.IsAny<Friendship>()), Times.Never);
    }

    [Fact]
    public async Task AcceptFriendRequestAsync_ValidRequest_ReturnsTrue()
    {
        // Arrange
        var userId = 2; // Receiver
        var requestorId = 1;
        var friendship = new Friendship { ReceiverId = userId, RequestorId = requestorId, Status = FriendshipStatus.Pending };
        var receiver = new User { Id = userId, FullName = "Receiver" };

        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(userId, requestorId)).ReturnsAsync(friendship);
        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(receiver);

        // Act
        var result = await _friendshipService.AcceptFriendRequestAsync(userId, requestorId);

        // Assert
        Assert.True(result);
        Assert.Equal(FriendshipStatus.Accepted, friendship.Status);
        _friendshipRepoMock.Verify(r => r.Update(friendship), Times.Once);
        _friendshipRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        _notificationServiceMock.Verify(n => n.SendNotificationAsync(requestorId, "FriendAccepted", It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task AcceptFriendRequestAsync_InvalidStatus_ReturnsFalse()
    {
        // Arrange
        var userId = 2;
        var requestorId = 1;
        var friendship = new Friendship { ReceiverId = userId, RequestorId = requestorId, Status = FriendshipStatus.Accepted }; // Already accepted

        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(userId, requestorId)).ReturnsAsync(friendship);

        // Act
        var result = await _friendshipService.AcceptFriendRequestAsync(userId, requestorId);

        // Assert
        Assert.False(result);
        _friendshipRepoMock.Verify(r => r.Update(It.IsAny<Friendship>()), Times.Never);
    }

    [Fact]
    public async Task DeleteFriendshipAsync_ExistingFriendship_ReturnsTrue()
    {
        // Arrange
        var userId1 = 1;
        var userId2 = 2;
        var friendship = new Friendship();
        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(userId1, userId2)).ReturnsAsync(friendship);

        // Act
        var result = await _friendshipService.DeleteFriendshipAsync(userId1, userId2);

        // Assert
        Assert.True(result);
        _friendshipRepoMock.Verify(r => r.Remove(friendship), Times.Once);
        _friendshipRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetFriendsAsync_ReturnsFriendList()
    {
        // Arrange
        var userId = 1;
        var friends = new List<Friendship>
        {
            new Friendship { RequestorId = userId, Receiver = new User { Id = 2, FullName = "Friend Two" }, Status = FriendshipStatus.Accepted, CreatedAt = DateTime.UtcNow },
            new Friendship { ReceiverId = userId, Requestor = new User { Id = 3, FullName = "Friend Three" }, Status = FriendshipStatus.Accepted, CreatedAt = DateTime.UtcNow }
        };
        _friendshipRepoMock.Setup(r => r.GetFriendsByUserIdAsync(userId)).ReturnsAsync(friends);

        // Act
        var result = await _friendshipService.GetFriendsAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
    }
}
