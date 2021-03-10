using System;
using System.Collections.Generic;

namespace Niftified.Entities
{
	public class Wallet
	{
		public int Id { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }

		public string PublicKey { get; set; }
		public string PrivateKeyEncrypted { get; set; }
		public string ReceivingAddress { get; set; } // for commision etc.
	}
}