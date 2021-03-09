using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Person
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public string UniqueId { get; set; } // hash
		public string Alias { get; set; }

		public int? AccountId { get; set; } // reference to account
		public Account Account { get; set; }

		public Status Status { get; set; }
		public double SalesCommision { get; set; } // note that all commisions for creator and co-creators cannot exceed 100%
	}
}