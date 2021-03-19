using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreateWalletRequest
	{
		[Required]
		public int PersonId { get; set; } // must be owned by a person

		public string Name { get; set; }


		[EnumDataType(typeof(WalletType))]
		public string Type { get; set; } // can be used to identify different types of wallets

		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commision payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }

	}
}