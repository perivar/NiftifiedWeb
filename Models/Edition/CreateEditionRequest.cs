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

		// note that all commissions for creators cannot exceed 100%
		// defaults to only one creator with 100% of the sales commission defined in SalesCommissionToCreators
		public List<int> CreatorPersonIds { get; set; } = new List<int>();
		public List<decimal> CreatorCommissionShares { get; set; } = new List<decimal>();
		public List<string> CreatorPersonAliases { get; set; } = new List<string>();


		[Required]
		public int VolumesCount { get; set; }  // how many volumes to create, could be only one

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
		// whether the only creator is the account owner
		// if so the only entry in the CreatorIds list is the account person
		// and the only entry in the CreatorsSalesCommissionShare is 100
		public bool AccountIsCreator { get; set; }

		public decimal Amount { get; set; } // Initial amount for auctions or the selling price for fixed price sales
		public string CurrencyUniqueId { get; set; }

		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commission payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }
		#endregion
	}
}
