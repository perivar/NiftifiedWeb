using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Person
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }

		public Account Account { get; set; } // reference to account
		public int AccountId { get; set; }

		public string Alias { get; set; } // if not an creator, might not want to use this to remain anynomous, only hash
		public bool IsAnonymous { get; set; } // don't show any information that might give this person away

		public Status Status { get; set; }

		public PersonType Type { get; set; } // creator, co-creator?

		public bool IsConfirmed { get; set; } // is this person confirmed, used when being a confirmed Creator 

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		public double SalesCommisionShare { get; set; }

		public List<Wallet> Wallets { get; set; }
	}
}