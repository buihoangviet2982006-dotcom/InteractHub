using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly IRepository<AppImage> _imageRepository;

    public ImagesController(IRepository<AppImage> imageRepository)
    {
        _imageRepository = imageRepository;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (file.Length > 5 * 1024 * 1024) // 5MB limit
            return BadRequest("File size exceeds 5MB limit.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid image format.");

        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        var appImage = new AppImage
        {
            FileName = file.FileName,
            ContentType = file.ContentType,
            Data = memoryStream.ToArray()
        };

        await _imageRepository.AddAsync(appImage);
        await _imageRepository.SaveChangesAsync();

        // Return the URL to access this image
        var imageUrl = $"/api/images/{appImage.Id}";
        return Ok(new { id = appImage.Id, url = imageUrl });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetImage(int id)
    {
        var image = await _imageRepository.GetByIdAsync(id);
        if (image == null)
            return NotFound();

        return File(image.Data, image.ContentType);
    }
}
