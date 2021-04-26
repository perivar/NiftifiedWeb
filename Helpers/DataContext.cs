using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
		public DbSet<Likes> Likes { get; set; }
		public DbSet<Tx> Txs { get; set; }
		public DbSet<Address> Addresses { get; set; }
		public DbSet<AddressTx> AddressTxs { get; set; }
		public DbSet<Wallet> Wallets { get; set; }

		private readonly ILoggerFactory _loggerFactory;
		// 	= LoggerFactory.Create(builder => { builder.AddConsole(); });

		private readonly IConfiguration _configuration;

		public DataContext(IConfiguration configuration, ILoggerFactory loggerFactory)
		{
			_loggerFactory = loggerFactory;
			_configuration = configuration;
		}

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			base.OnConfiguring(optionsBuilder);

			// logger
			// TODO: remove this from production
			optionsBuilder.UseLoggerFactory(_loggerFactory);
			optionsBuilder.EnableSensitiveDataLogging();

			var connectionString = _configuration.GetConnectionString("DefaultConnection");

			// create a sub directory for the database
			var builder = new DbConnectionStringBuilder();
			builder.ConnectionString = connectionString;
			string dataSource = builder["Data Source"] as string;
			string dataSourcePath = Path.GetDirectoryName(dataSource);
			if (!Directory.Exists(dataSourcePath))
			{
				Directory.CreateDirectory(dataSourcePath);
			}

			// connect to sqlite database
			optionsBuilder.UseSqlite(connectionString);

			// or to mysql database
			// optionsBuilder.UseMySQL()
		}

		#region Custom Value Converter for Int Array Support 
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// support for int arrays
			var intArrayConverter = new ValueConverter<int[], string>(
							v => string.Join(";", v),
							v => v.Split(";", StringSplitOptions.RemoveEmptyEntries)
							.Select(val => int.Parse(val))
							.ToArray());

			var intArrayComparer = new ValueComparer<int[]>(
				(c1, c2) => c1.SequenceEqual(c2),
				c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
				c => c.ToArray());

			// support for string arrays
			var stringArrayConverter = new ValueConverter<ICollection<string>, string>(
				v => JsonSerializer.Serialize(v, null),
				v => JsonSerializer.Deserialize<List<string>>(v, null)
			);

			var stringArrayComparer = new ValueComparer<ICollection<string>>(
				(c1, c2) => c1.SequenceEqual(c2),
				c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
				c => (ICollection<string>)c.ToList());


			// create composite key for Creator
			modelBuilder.Entity<Creator>()
				   .HasKey(c => new { c.EditionId, c.WalletId });

			// build model
			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedEditionIds)
				.HasConversion(intArrayConverter)
				.Metadata
				.SetValueComparer(intArrayComparer);

			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedWalletIds)
				.HasConversion(intArrayConverter)
				.Metadata
				.SetValueComparer(intArrayComparer);

			modelBuilder.Entity<Likes>()
				.Property(e => e.LikedVolumeIds)
				.HasConversion(intArrayConverter)
				.Metadata
				.SetValueComparer(intArrayComparer);
		}
		#endregion
	}
}