using System.Text.Json.Serialization;

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
    [JsonPropertyName("fullName")]
    public string FullName { get; set; } = string.Empty;
    
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
}

public class ChangePasswordDto
{
    [JsonPropertyName("oldPassword")]
    public string OldPassword { get; set; } = string.Empty;
    
    [JsonPropertyName("newPassword")]
    public string NewPassword { get; set; } = string.Empty;
}

public class UserProfileDto : UserDto
{
    public int FriendCount { get; set; }
    public bool IsFriend { get; set; }
    public bool RequestSent { get; set; }
}
