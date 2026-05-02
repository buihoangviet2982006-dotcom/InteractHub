using System;

namespace Backend.Models;
public class Hashtag : Entity
{

    public string? Name { get; set; }

    public virtual ICollection<Post> PostHashtags { get; set; } = new List<Post>();
}