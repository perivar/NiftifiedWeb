using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Transaction
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }

		public string Description { get; set; }

		public TransactionType Type { get; set; }

		public Offer ApprovedOffer { get; set; }

		public Edition Edition { get; set; }
		public Volume Volume { get; set; }

		public double Amount { get; set; }
		public string CurrencyUniqueId { get; set; }

		// History
		// Bought 3 editions for 0.15 ETH 2 minutes ago by Janus-Faced
		// Offer cancelled 1 days ago by 0x54ec6aa23...0be4
		// Offered 1 WETH for 1 edition 1 days ago by 0x2ace7105b...345c
		// Offered 0.3 WETH for 1 edition 1 days ago by 0x54ec6aa23...0be4
		// Offered 1.01 WETH for 1 edition 1 days ago by 0x9fd2f92b9...3600
		// Put on Sale for 0.15 NFY 19 minutes ago by lakshepassion
		// Minted 2 hours ago by Silvia Puff cuties (a whole batch)
		// => find out through same edition id (note edition needs minted date)

	}

}