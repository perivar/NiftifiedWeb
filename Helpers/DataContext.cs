using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
		public DbSet<Tag> Tags { get; set; }
		public DbSet<Offer> Offers { get; set; }
		public DbSet<Person> Persons { get; set; }
		public DbSet<Likes> Likes { get; set; }
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

		#region Custom Value Converter for Int Array Support 
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			var converter = new ValueConverter<int[], string>(
							v => string.Join(";", v),
							v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).Select(val => int.Parse(val)).ToArray());

			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedEditionIds)
				.HasConversion(converter);
			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedPersonIds)
				.HasConversion(converter);
			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedVolumeIds)
				.HasConversion(converter);
		}
		#endregion
	}
}