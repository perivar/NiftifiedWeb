using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Tx
	{
		public int Id { get; set; }
		public string TxId { get; set; } // { type: String, lowercase: true, unique: true, index: true},
		public string Vin { get; set; } // { type: Array, default: [] },
		public string Vout { get; set; } // { type: Array, default: [] },
		public double Total { get; set; } // { type: Number, default: 0, index: true },
		public DateTime Timestamp { get; set; } // { type: Number, default: 0, index: true },
		public string BlockHash { get; set; } // { type: String, index: true },
		public int BlockIndex { get; set; } // {type: Number, default: 0, index: true},
	}
}

