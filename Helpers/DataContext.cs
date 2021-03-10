using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Niftified.Entities;
using Pomelo.EntityFrameworkCore.MySql.Storage;

namespace Niftified.Helpers
{
	public class DataContext : DbContext
	{
		public DbSet<Account> Accounts { get; set; }
		public DbSet<Edition> Editions { get; set; }
		public DbSet<Volume> Volumes { get; set; }
		public DbSet<Collection> Collections { get; set; }
		public DbSet<Offer> Offers { get; set; }
		public DbSet<Person> Persons { get; set; }
		public DbSet<Tx> Txs { get; set; }
		public DbSet<Address> Addresses { get; set; }
		public DbSet<AddressTx> AddressTxs { get; set; }

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