using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class NotificationRepository : Repository<Notification>, INotificationRepository
{
    public NotificationRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<List<Notification>> GetNotificationsByUserIdAsync(int userId, int limit = 20)
    {
        return await _dbSet
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Notification?> GetNotificationAsync(int id)
    {
        return await _dbSet.FirstOrDefaultAsync(n => n.Id == id);
    }
    
    public async Task MarkAllAsReadAsync(int userId)
    {
        var notifications = await _dbSet.Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
        foreach (var n in notifications)
        {
            n.IsRead = true;
        }
    }
}
