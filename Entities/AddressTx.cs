using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class AddressTx
	{
		public int Id { get; set; }
		public string AddressId { get; set; } // { type: String, index: true},
		public int BlockIndex { get; set; } // {type: Number, default: 0, index: true},
		public string TxId { get; set; } // { type: String, lowercase: true, index: true},
		public decimal Amount { get; set; } // { type: Number, default: 0, index: true}
	}
}




