using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class VolumeResponse
	{
		public int Id { get; set; }

		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }


		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		public Person Owner { get; set; }

		public VolumeStatus Status { get; set; } // for sale, not for sale
		public VolumeType Type { get; set; } // auction, fixed price

		public decimal Amount { get; set; } // Initial amount for auctions or the selling price for fixed price sales
		public string CurrencyUniqueId { get; set; }


		// An 'edition' of a print is a limited set of identical prints made from the same plate. 
		// Editioned prints must be identical. 
		public int EditionId { get; set; } // reference that connects several items into one bacth

		// volume of the edition in the print number (e.g. "15/30" for the 15th print in an edition of 30). 
		public int EditionNumber { get; set; } // e.g. number 15 of 30
	}
}