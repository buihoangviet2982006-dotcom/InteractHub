using System;

namespace Backend.Models;
public class Friendship : Entity
{

    public int RequestorId { get; set; } 
    public virtual User? Requestor { get; set; }

    public int ReceiverId { get; set; }
    public virtual User? Receiver { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}