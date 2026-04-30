using System;

namespace Backend.Models;
public enum FriendshipStatus
{
    Pending,
    Accepted,
    Declined
}

public class Friendship : Entity
{

    public int RequestorId { get; set; } 
    public virtual User? Requestor { get; set; }

    public int ReceiverId { get; set; }
    public virtual User? Receiver { get; set; }

    public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}