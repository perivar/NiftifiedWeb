using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Wallets
{
	public class CreateWalletRequest
	{
		[Required]
		public string Alias { get; set; } // if not an creator, might not want to use this to remain anynomous, only hash

		public bool IsAnonymous { get; set; } // don't show any information that might give this wallet away

		[Required]
		public int AccountId { get; set; }


		[EnumDataType(typeof(Status))]
		public string Status { get; set; }

		public bool IsConfirmed { get; set; } // is this wallet confirmed, used when being a confirmed Creator 

		[EnumDataType(typeof(WalletType))]
		public string Type { get; set; } // can be used to identify different types of wallets


		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PrivateMnemonicEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commission payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }

	}
}