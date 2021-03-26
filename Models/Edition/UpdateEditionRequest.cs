using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Editions
{
	public class UpdateEditionRequest
	{
		public int AccountId { get; set; } // account
		public string LanguageCode { get; set; }

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?


		public decimal SalesCommissionToCreators { get; set; }


		// TODO: how can we update the volumes after they are created?
		// public List<Volume> Volumes { get; set; } // at least one needs to exist
		// public int VolumeCount { get; set; }  // number of volumes, should be the same as Volumes.Count		

		public string Name { get; set; }
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
		public IFormFile File { get; set; }

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