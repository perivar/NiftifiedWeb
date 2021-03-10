using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Person
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }
		public string UniqueId { get; set; } // hash

		public string Alias { get; set; } // might not want to use name, only hash

		public int AccountId { get; set; }
		public Account Account { get; set; } // reference to account

		public Status Status { get; set; }

		public PersonType Type { get; set; } // creator, co-creator?

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		public double SalesCommisionShare { get; set; }

		public List<Wallet> Wallets { get; set; }
	}
}