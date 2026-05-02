using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Hashtag> Hashtags { get; set; }
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Story> Stories { get; set; }
    public DbSet<PostReport> PostReports { get; set; }
    // Đã xóa DbSet<AppImage> - ảnh giờ lưu trực tiếp trong User và Post

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Bio).HasMaxLength(1000);
            entity.Property(u => u.AvatarData).HasColumnType("varbinary(max)");
            entity.Property(u => u.CoverData).HasColumnType("varbinary(max)");
        });

        // Post configuration
        modelBuilder.Entity<Post>(entity =>
        {
            entity.Property(p => p.Content).HasMaxLength(2000);
            entity.Property(p => p.ImageData).HasColumnType("varbinary(max)");
            
            entity.HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment configuration
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.Property(c => c.Content).IsRequired().HasMaxLength(1000);
            
            entity.HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Like configuration
        modelBuilder.Entity<Like>(entity =>
        {
            entity.HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Hashtag configuration
        modelBuilder.Entity<Hashtag>(entity =>
        {
            entity.Property(h => h.Name).IsRequired().HasMaxLength(50);
            entity.HasIndex(h => h.Name).IsUnique();
        });

        // Many-to-Many Post <-> Hashtag
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Hashtags)
            .WithMany(h => h.PostHashtags)
            .UsingEntity(j => j.ToTable("PostHashtags"));

        // Friendship configuration (Mutual relationship to User)
        modelBuilder.Entity<Friendship>(entity =>
        {
            entity.HasOne(f => f.Requestor)
                .WithMany(u => u.SentRequests)
                .HasForeignKey(f => f.RequestorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(f => f.Receiver)
                .WithMany(u => u.ReceivedRequests)
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Notification configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.Property(n => n.Content).IsRequired().HasMaxLength(500);
            entity.Property(n => n.Type).IsRequired().HasMaxLength(50);

            entity.HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Story>(entity =>
        {
            entity.Property(s => s.MediaData).HasColumnType("varbinary(max)");
            entity.Property(s => s.Content).HasMaxLength(2000);

            entity.HasOne(s => s.User)
                .WithMany(u => u.Stories)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // PostReport configuration
        modelBuilder.Entity<PostReport>(entity =>
        {
            entity.Property(pr => pr.Reason).IsRequired().HasMaxLength(500);

            entity.HasOne(pr => pr.Reporter)
                .WithMany() 
                .HasForeignKey(pr => pr.ReporterId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(pr => pr.Post)
                .WithMany(p => p.PostReports)
                .HasForeignKey(pr => pr.PostId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
