using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Address
	{
		public int Id { get; set; }
		public string AddressId { get; set; } // { type: String, unique: true, index: true},
		public string Name { get; set; } // { type: String, default: '', index: true},
		public decimal Received { get; set; } // { type: Number, default: 0, index: true },
		public decimal Sent { get; set; } // { type: Number, default: 0, index: true },
		public decimal Balance { get; set; } // {type: Number, default: 0, index: true},
	}
}


