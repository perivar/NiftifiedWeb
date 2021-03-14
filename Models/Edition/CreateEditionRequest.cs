using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreateEditionRequest
	{
		[Required]
		public int AccountId { get; set; } // account

		[Required]
		public string LanguageCode { get; set; }

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		// note the sales commision will have to add up to 100%
		public ICollection<int> CreatorIds { get; set; } = new List<int>();

		public double SalesCommisionToCreators { get; set; }

		[Required]
		public int VolumeTotal { get; set; } // how many volumes to create, could be only one


		[Required]
		public string Name { get; set; }

		[Required]
		public string Description { get; set; }

		public string Version { get; set; }
		public string Notes { get; set; }

		public string Series { get; set; }
		public string BoxName { get; set; }
		public string Theme { get; set; }

		public int? CollectionId { get; set; } // what collection is this part of

		public ICollection<int> TagIds { get; set; } = new List<int>(); // relevant tags for grouping


		#region Elements not included in the final edition, but to create the intitial volumes, owners, etc.
		[Required]
		public IFormFile File { get; set; }

		[Required]
		public bool AccountIsCreator { get; set; } // whether the only creator is the account owner

		public decimal Amount { get; set; } // Initial amount for auctions or the selling price for fixed price sales
		public string CurrencyUniqueId { get; set; }
		#endregion
	}
}
