using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Moq;

namespace Backend.Tests;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly Mock<IFriendshipRepository> _friendshipRepoMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _friendshipRepoMock = new Mock<IFriendshipRepository>();
        _userService = new UserService(_userRepoMock.Object, _friendshipRepoMock.Object);
    }

    [Fact]
    public async Task GetUserProfileAsync_WhenUserExists_ReturnsProfile()
    {
        // Arrange
        var userId = 1;
        var currentUserId = 2;
        var user = new User { Id = userId, FullName = "Test User", Email = "test@test.com" };
        var friends = new List<Friendship> { new Friendship() }; // 1 friend

        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);
        _friendshipRepoMock.Setup(r => r.GetFriendsByUserIdAsync(userId)).ReturnsAsync(friends);
        _friendshipRepoMock.Setup(r => r.GetFriendshipAsync(currentUserId, userId))
            .ReturnsAsync(new Friendship { Status = FriendshipStatus.Accepted });

        // Act
        var result = await _userService.GetUserProfileAsync(userId, currentUserId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(userId, result.Id);
        Assert.Equal(1, result.FriendCount);
        Assert.True(result.IsFriend);
        Assert.False(result.RequestSent);
    }

    [Fact]
    public async Task GetUserProfileAsync_WhenUserDoesNotExist_ReturnsNull()
    {
        // Arrange
        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((User)null);

        // Act
        var result = await _userService.GetUserProfileAsync(1);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateProfileAsync_WhenEmailExists_ThrowsException()
    {
        // Arrange
        var userId = 1;
        var dto = new UserUpdateDto { Email = "existing@test.com", FullName = "New Name" };
        var existingUser = new User { Id = userId, Email = "old@test.com" };
        var otherUserWithEmail = new User { Id = 2, Email = "existing@test.com" };

        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(existingUser);
        _userRepoMock.Setup(r => r.GetUserByEmailAsync(dto.Email)).ReturnsAsync(otherUserWithEmail);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _userService.UpdateProfileAsync(userId, dto));
        Assert.Equal("Email đã được sử dụng.", exception.Message);
    }

    [Fact]
    public async Task ChangePasswordAsync_WithValidOldPassword_ChangesPassword()
    {
        // Arrange
        var userId = 1;
        var oldPassword = "OldPassword123";
        var newPassword = "NewPassword123";
        var user = new User
        {
            Id = userId,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(oldPassword)
        };
        var dto = new ChangePasswordDto { OldPassword = oldPassword, NewPassword = newPassword };

        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        await _userService.ChangePasswordAsync(userId, dto);

        // Assert
        _userRepoMock.Verify(r => r.Update(user), Times.Once);
        _userRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        Assert.True(BCrypt.Net.BCrypt.Verify(newPassword, user.PasswordHash));
    }

    [Fact]
    public async Task ChangePasswordAsync_WithInvalidOldPassword_ThrowsException()
    {
        // Arrange
        var userId = 1;
        var user = new User
        {
            Id = userId,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("RealOldPassword")
        };
        var dto = new ChangePasswordDto { OldPassword = "WrongOldPassword", NewPassword = "NewPassword123" };

        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _userService.ChangePasswordAsync(userId, dto));
        Assert.Equal("Incorrect old password.", exception.Message);
        _userRepoMock.Verify(r => r.Update(It.IsAny<User>()), Times.Never);
    }
    
    [Fact]
    public async Task SearchUsersAsync_ReturnsUserDtos()
    {
        // Arrange
        var query = "Test";
        var users = new List<User>
        {
            new User { Id = 1, FullName = "Test One", Email = "one@test.com" },
            new User { Id = 2, FullName = "Test Two", Email = "two@test.com" }
        };
        _userRepoMock.Setup(r => r.SearchUsersAsync(query)).ReturnsAsync(users);

        // Act
        var result = await _userService.SearchUsersAsync(query);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task UpdateAvatarAsync_UpdatesAndSaves()
    {
        // Arrange
        var userId = 1;
        var avatarData = new byte[] { 1, 2, 3 };
        var user = new User { Id = userId };
        _userRepoMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        // Act
        await _userService.UpdateAvatarAsync(userId, avatarData);

        // Assert
        Assert.Equal(avatarData, user.AvatarData);
        _userRepoMock.Verify(r => r.Update(user), Times.Once);
        _userRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
