using Backend.Models;

namespace Backend.Repositories;

public interface INotificationRepository : IRepository<Notification>
{
    Task<List<Notification>> GetNotificationsByUserIdAsync(int userId, int limit = 20);
    Task<Notification?> GetNotificationAsync(int id);
    Task MarkAllAsReadAsync(int userId);
}
