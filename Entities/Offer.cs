using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Offer
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; }
		public OfferType Type { get; set; } // for sale, or bid
		public Status Status { get; set; }
		public int WalletId { get; set; }
		public Wallet Wallet { get; set; }
		public string WalletAlias { get; set; }
		public string WalletHashId { get; set; }

		public DateTime Created { get; set; }
		public string Description { get; set; }

		public decimal Amount { get; set; }
		public string CurrencyUniqueId { get; set; }
		public DateTime From { get; set; } // from when is the bid valid
		public DateTime To { get; set; } // expiration

		public decimal ServiceFeeAmount { get; set; }

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