using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using TheCompany.Model.Main;

namespace TheCompany.SQLServer.DataBase
{
    public class TheCompanyDBContext : IdentityDbContext
    {
        public TheCompanyDBContext(DbContextOptions<TheCompanyDBContext> options) : base(options)
        {

        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Employeeknowledge> Employeeknowledges { get; set; }
        public DbSet<Knowledge> Knowledges { get; set; }
        public DbSet<RequireToLearn> RequireToLearns { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RequireToLearn>()
                   .HasOne(a => a.KnowledgeBefore)
                   .WithMany(m => m.EmployeesStart)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RequireToLearn>()
                   .HasOne(a => a.KnowledgeNext)
                   .WithMany(m => m.EmployeesEnd)
                   .OnDelete(DeleteBehavior.Restrict);


        }
    }
}
