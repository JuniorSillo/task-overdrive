using Microsoft.EntityFrameworkCore;
using TaskOverdrive.Domain;

namespace TaskOverdrive.Infrastructure.Persistance;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

    public DbSet<WorkTask> WorkTasks => Set<WorkTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<WorkTask>(entity =>
        {
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Title).IsRequired().HasMaxLength(200);

            entity.Property(m => m.Description).HasMaxLength(1000);


            entity.HasIndex(m => m.Title).IsUnique().HasDatabaseName("WorkTask_Title_Unique");

            entity.ToTable(m => m.HasCheckConstraint("Check_WorkTasks_Priority","\"Priority\" BETWEEN 1 AND 5"));


        });
    }
}