using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Editions
{
	public class CreateEditionRequest
	{
		[Required]
		public int AccountId { get; set; } // account

		[Required]
		public string LanguageCode { get; set; }

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		public decimal SalesCommissionToCreators { get; set; }

		[Required]
		public int VolumeCount { get; set; }  // how many volumes to create, could be only one

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
		// used to create file reference
		[Required]
		public IFormFile File { get; set; }

		// used to set owner
		[Required]
		public int OwnerPersonId { get; set; }

		// used to create volumes
		public decimal Amount { get; set; } // Initial amount for auctions or the selling price for fixed price sales
		public string CurrencyUniqueId { get; set; }

		// used to set creators
		// note that all commissions for creators cannot exceed 100%
		// defaults to only one creator with 100% of the sales commission defined in SalesCommissionToCreators
		public List<int> CreatorPersonIds { get; set; } = new List<int>();
		public List<decimal> CreatorCommissionShares { get; set; } = new List<decimal>();
		public List<string> CreatorPersonAliases { get; set; } = new List<string>();
		public List<int> CreatorPersonTypes { get; set; } = new List<int>();

		#endregion
	}
}
