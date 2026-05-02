using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IFriendshipRepository _friendshipRepo;
    private readonly IUserRepository _userRepo;
    private readonly INotificationService _notificationService;

    public FriendshipService(IFriendshipRepository friendshipRepo, IUserRepository userRepo, INotificationService notificationService)
    {
        _friendshipRepo = friendshipRepo;
        _userRepo = userRepo;
        _notificationService = notificationService;
    }

    public async Task<bool> SendFriendRequestAsync(int requestorId, FriendshipCreateDto dto)
    {
        if (requestorId == dto.ReceiverId) return false;

        var requestor = await _userRepo.GetByIdAsync(requestorId);
        var receiver = await _userRepo.GetByIdAsync(dto.ReceiverId);
        if (requestor == null || receiver == null) return false;

        var existing = await _friendshipRepo.GetFriendshipAsync(requestorId, dto.ReceiverId);
        if (existing != null)
        {
            // Nếu đã là bạn bè hoặc đang chờ xác nhận thì không gửi lại
            if (existing.Status == FriendshipStatus.Accepted || existing.Status == FriendshipStatus.Pending)
                return false;

            // Nếu đã bị từ chối, ta cập nhật lại bản ghi này thành Pending
            existing.RequestorId = requestorId;
            existing.ReceiverId = dto.ReceiverId;
            existing.Status = FriendshipStatus.Pending;
            existing.CreatedAt = DateTime.UtcNow;
            _friendshipRepo.Update(existing);
        }
        else
        {
            var friendship = new Friendship
            {
                RequestorId = requestorId,
                ReceiverId = dto.ReceiverId,
                Status = FriendshipStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            await _friendshipRepo.AddAsync(friendship);
        }

        await _friendshipRepo.SaveChangesAsync();
        await _notificationService.SendNotificationAsync(dto.ReceiverId, "FriendRequest", $"{requestor.FullName ?? "Một người dùng"} đã gửi lời mời kết bạn.");

        return true;
    }

    public async Task<bool> DeleteFriendshipAsync(int userId1, int userId2)
    {
        var friendship = await _friendshipRepo.GetFriendshipAsync(userId1, userId2);
        if (friendship == null) return false;

        _friendshipRepo.Remove(friendship);
        await _friendshipRepo.SaveChangesAsync();
        return true;
    }

    public async Task<List<FriendshipResponseDto>> GetFriendsAsync(int userId)
    {
        var friends = await _friendshipRepo.GetFriendsByUserIdAsync(userId);
        var response = new List<FriendshipResponseDto>();

        foreach (var f in friends)
        {
            var isRequestor = f.RequestorId == userId;
            var friendUser = isRequestor ? f.Receiver : f.Requestor;
            
            if (friendUser == null) continue;

            response.Add(new FriendshipResponseDto
            {
                FriendId = friendUser.Id,
                FriendName = friendUser.FullName ?? string.Empty,
                FriendAvatarData = friendUser.AvatarData,
                Status = f.Status.ToString(),
                CreatedAt = f.CreatedAt
            });
        }

        return response.OrderByDescending(r => r.CreatedAt).ToList();
    }

    public async Task<bool> AcceptFriendRequestAsync(int userId, int requestorId)
    {
        var friendship = await _friendshipRepo.GetFriendshipAsync(userId, requestorId);
        if (friendship == null || friendship.ReceiverId != userId || friendship.Status != FriendshipStatus.Pending)
            return false;

        friendship.Status = FriendshipStatus.Accepted;
        _friendshipRepo.Update(friendship);
        await _friendshipRepo.SaveChangesAsync();

        var receiver = await _userRepo.GetByIdAsync(userId);
        await _notificationService.SendNotificationAsync(requestorId, "FriendAccepted", $"{receiver?.FullName ?? "Một người dùng"} đã chấp nhận lời mời kết bạn.");

        return true;
    }

    public async Task<bool> DeclineFriendRequestAsync(int userId, int requestorId)
    {
        var friendship = await _friendshipRepo.GetFriendshipAsync(userId, requestorId);
        if (friendship == null || friendship.ReceiverId != userId || friendship.Status != FriendshipStatus.Pending)
            return false;

        friendship.Status = FriendshipStatus.Declined;
        _friendshipRepo.Update(friendship);
        await _friendshipRepo.SaveChangesAsync();
        return true;
    }

    public async Task<List<FriendshipResponseDto>> GetPendingRequestsAsync(int userId)
    {
        var requests = await _friendshipRepo.GetPendingRequestsByUserIdAsync(userId);
        var response = new List<FriendshipResponseDto>();

        foreach (var r in requests)
        {
            var requestor = r.Requestor;
            if (requestor == null) continue;

            response.Add(new FriendshipResponseDto
            {
                FriendId = requestor.Id,
                FriendName = requestor.FullName ?? string.Empty,
                FriendAvatarData = requestor.AvatarData,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt
            });
        }

        return response.OrderByDescending(r => r.CreatedAt).ToList();
    }

    public async Task<List<FriendshipResponseDto>> GetSentRequestsAsync(int userId)
    {
        var requests = await _friendshipRepo.GetSentRequestsByUserIdAsync(userId);
        var response = new List<FriendshipResponseDto>();

        foreach (var r in requests)
        {
            var receiver = r.Receiver;
            if (receiver == null) continue;

            response.Add(new FriendshipResponseDto
            {
                FriendId = receiver.Id,
                FriendName = receiver.FullName ?? string.Empty,
                FriendAvatarData = receiver.AvatarData,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt
            });
        }

        return response.OrderByDescending(r => r.CreatedAt).ToList();
    }
}
