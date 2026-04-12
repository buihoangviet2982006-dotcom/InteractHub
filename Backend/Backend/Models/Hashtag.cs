using System;

namespace Backend.Models;
public class Hashtag : Entity
{
    public int Id { get; set; }
    public string? Name { get; set; }

    public virtual ICollection<Post> PostHashtags { get; set; } = new List<Post>();
}