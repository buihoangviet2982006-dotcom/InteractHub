namespace Backend.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public byte[]? AvatarData { get; set; }
    public byte[]? CoverData { get; set; }
}

public class UserUpdateDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Bio { get; set; }
}

public class UserProfileDto : UserDto
{
    public int FriendCount { get; set; }
    public bool IsFriend { get; set; }
    public bool RequestSent { get; set; }
}
