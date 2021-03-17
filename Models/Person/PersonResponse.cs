using System;
using System.Collections.Generic;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class PersonResponse
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }

		// section for information used for the blockchain 
		public string UniqueId { get; set; } // hash
		public string PublicKey { get; set; }
		public string PrivateKeyEncrypted { get; set; }
		public string BlockchainAddress { get; set; } // where to send commision payments to?

		public string Alias { get; set; } // might not want to use name, only hash

		public Account Account { get; set; } // reference to account

		public Status Status { get; set; }

		public PersonType Type { get; set; } // creator, co-creator?

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		public double SalesCommisionShare { get; set; }

		public List<Wallet> Wallets { get; set; }
	}
}