using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
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
		public DbSet<Wallet> Wallets { get; set; }

		public static readonly ILoggerFactory _loggerFactory
			= LoggerFactory.Create(builder => { builder.AddConsole(); });

		private readonly IConfiguration Configuration;

		public DataContext(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			// logger
			// TODO: remove this from production
			optionsBuilder.UseLoggerFactory(_loggerFactory);
			optionsBuilder.EnableSensitiveDataLogging();

			// connect to sqlite database
			optionsBuilder.UseSqlite(Configuration.GetConnectionString("NiftifiedDatabase"));

			// or to mysql database
			// optionsBuilder.UseMySQL(Configuration.GetConnectionString("DefaultConnection"));

			base.OnConfiguring(optionsBuilder);
		}

		#region Custom Value Converter for Int Array Support 
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// create composite key for Creator
			modelBuilder.Entity<Creator>()
				   .HasKey(c => new { c.EditionId, c.PersonId });

			// support int arrays
			var intArrayConverter = new ValueConverter<int[], string>(
							v => string.Join(";", v),
							v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).Select(val => int.Parse(val)).ToArray());

			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedEditionIds)
				.HasConversion(intArrayConverter);
			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedPersonIds)
				.HasConversion(intArrayConverter);
			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedVolumeIds)
				.HasConversion(intArrayConverter);
		}
		#endregion
	}
}