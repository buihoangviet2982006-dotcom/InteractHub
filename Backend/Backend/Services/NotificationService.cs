using Backend.DTOs;
using Backend.Hubs;
using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepo;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(INotificationRepository notificationRepo, IHubContext<NotificationHub> hubContext)
    {
        _notificationRepo = notificationRepo;
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(int receiverId, string type, string content)
    {
        var notification = new Notification
        {
            UserId = receiverId,
            Type = type,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        await _notificationRepo.AddAsync(notification);
        await _notificationRepo.SaveChangesAsync();

        var dto = new NotificationResponseDto
        {
            Id = notification.Id,
            Content = notification.Content,
            Type = notification.Type,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };

        // Gửi qua WebSocket
        await _hubContext.Clients.User(receiverId.ToString()).SendAsync("ReceiveNotification", dto);
    }

    public async Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId)
    {
        var notifications = await _notificationRepo.GetNotificationsByUserIdAsync(userId);
        return notifications.Select(n => new NotificationResponseDto
        {
            Id = n.Id,
            Content = n.Content ?? string.Empty,
            Type = n.Type ?? string.Empty,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();
    }

    public async Task<bool> MarkAsReadAsync(int notificationId, int userId)
    {
        var notification = await _notificationRepo.GetNotificationAsync(notificationId);
        if (notification == null || notification.UserId != userId) return false;

        notification.IsRead = true;
        await _notificationRepo.SaveChangesAsync();
        return true;
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _notificationRepo.MarkAllAsReadAsync(userId);
        await _notificationRepo.SaveChangesAsync();
    }
}
