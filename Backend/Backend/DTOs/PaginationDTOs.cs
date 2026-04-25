namespace Backend.DTOs;

public class CursorPaginationDto
{
    // ID của phần tử cuối cùng ở trang trước. Nếu là null thì lấy từ đầu (trang 1).
    public int? CursorId { get; set; } 
    
    // Giới hạn số lượng trả về mỗi lần cuộn
    public int Limit { get; set; } = 10;
}

public class CursorPagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int? NextCursorId { get; set; }
    public bool HasNextPage { get; set; }
}
