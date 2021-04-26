using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Creator
	{
		// create a composite key to ensure there is never more than one identical wallet connected to one edition

		public Edition Edition { get; set; }
		public int EditionId { get; set; }

		public Wallet Wallet { get; set; }
		public int WalletId { get; set; }

		public CreatorType Type { get; set; }

		// share out of 100% that this creator has, if only one this is 100%
		public decimal SalesCommissionShare { get; set; }
	}
}
