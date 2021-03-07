using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Niftified.Entities;
using Pomelo.EntityFrameworkCore.MySql.Storage;

namespace Niftified.Helpers
{
	public class DataContext : DbContext
	{
		public DbSet<Account> Accounts { get; set; }

		private readonly IConfiguration Configuration;

		public DataContext(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		protected override void OnConfiguring(DbContextOptionsBuilder options)
		{
			// connect to sqlite database
			options.UseSqlite(Configuration.GetConnectionString("NiftifiedDatabase"));

			// or to mysql database
			// options.UseMySQL(Configuration.GetConnectionString("DefaultConnection"));
		}
	}
}