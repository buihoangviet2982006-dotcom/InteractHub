using Backend.DTOs;
using Backend.Hubs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Backend.Tests;

public class NotificationServiceTests
{
    private readonly Mock<INotificationRepository> _notificationRepoMock;
    private readonly Mock<IHubContext<NotificationHub>> _hubContextMock;
    private readonly NotificationService _notificationService;

    public NotificationServiceTests()
    {
        _notificationRepoMock = new Mock<INotificationRepository>();
        _hubContextMock = new Mock<IHubContext<NotificationHub>>();
        
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();
        
        _hubContextMock.Setup(h => h.Clients).Returns(clientsMock.Object);
        clientsMock.Setup(c => c.User(It.IsAny<string>())).Returns(clientProxyMock.Object);

        _notificationService = new NotificationService(_notificationRepoMock.Object, _hubContextMock.Object);
    }

    [Fact]
    public async Task SendNotificationAsync_SavesAndSends()
    {
        // Act
        await _notificationService.SendNotificationAsync(1, "Type", "Content");

        // Assert
        _notificationRepoMock.Verify(r => r.AddAsync(It.IsAny<Notification>()), Times.Once);
        _notificationRepoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        _hubContextMock.Verify(h => h.Clients.User("1"), Times.Once);
    }

    [Fact]
    public async Task GetNotificationsAsync_ReturnsList()
    {
        // Arrange
        var notifications = new List<Notification> { new Notification(), new Notification() };
        _notificationRepoMock.Setup(r => r.GetNotificationsByUserIdAsync(1)).ReturnsAsync(notifications);

        // Act
        var result = await _notificationService.GetNotificationsAsync(1);

        // Assert
        Assert.Equal(2, result.Count);
    }
}
