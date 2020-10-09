using Microsoft.EntityFrameworkCore;
using TestCase.Entities;

namespace TestCase
{
    public class ApplicationContext : DbContext
    {
        public DbSet<TransactionEntity> Transactions { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TransactionEntity>()
                .Property(i => i.Amount)
                .HasColumnType("money");

            modelBuilder.Entity<TransactionEntity>()
                .Property(i => i.Id)
                .ValueGeneratedNever();
        }
    }
}
