using Backend.DTOs;

namespace Backend.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AvatarUpdateResponseDto> UpdateAvatarAsync(int userId, AvatarUpdateDto dto);
}
