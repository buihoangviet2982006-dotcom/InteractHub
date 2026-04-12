using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;
public class AppDbContext : DbContext
{
    public DbSet<User> 
}