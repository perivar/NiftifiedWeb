using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Volume
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

		// Bids
		// Last Bid
		// 3 editions in wallet, not for sale by storm
		// 0.16 WETH by The Collector
		// 1.5 WETH expired by 0xb52e2dbf7...ae06
		// 1.25 WETH by C.Camaro
		// 1.01 WETH expired by 0x9fd2f92b9...3600

		// Service fee 2.5%. 0.246 ETH $430.37
	}
}