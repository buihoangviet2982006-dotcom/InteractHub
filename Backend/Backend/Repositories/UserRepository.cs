using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

// Bạn hoàn toàn có thể đặt Interface và Class trong cùng một file để dễ quản lý
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetUserByEmailAsync(string email);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }
}
