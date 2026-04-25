using Backend.DTOs;

namespace Backend.Services;

public interface INotificationService
{
    Task SendNotificationAsync(int receiverId, string type, string content);
    Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId);
    Task<bool> MarkAsReadAsync(int notificationId, int userId);
}
