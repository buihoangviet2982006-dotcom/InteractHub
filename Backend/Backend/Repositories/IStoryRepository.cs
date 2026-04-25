using Backend.Models;

namespace Backend.Repositories;

public interface IStoryRepository : IRepository<Story>
{
    Task<List<Story>> GetActiveStoriesAsync();
    Task<List<Story>> GetActiveStoriesByUserIdAsync(int userId);
}
