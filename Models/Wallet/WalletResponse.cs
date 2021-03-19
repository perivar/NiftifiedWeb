using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class WalletResponse
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }

		public int PersonId { get; set; } // must be owned by a person

		public string Name { get; set; }

		public WalletType Type { get; set; } // can be used to identify different types of wallets

		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commision payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }
	}
}