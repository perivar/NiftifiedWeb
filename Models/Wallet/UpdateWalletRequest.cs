using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Wallets
{
	public class UpdateWalletRequest
	{
		private string _status;
		private string _type;

		public int AccountId { get; set; } // must be owned by an account


		[EnumDataType(typeof(WalletType))]
		public string Type
		{
			get => _type;
			set => _type = replaceEmptyWithNull(value);
		}

		public string Alias { get; set; } // if not an creator, might not want to use this to remain anynomous, only hash
		public bool IsAnonymous { get; set; } // don't show any information that might give this wallet away


		[EnumDataType(typeof(Status))]
		public string Status
		{
			get => _status;
			set => _status = replaceEmptyWithNull(value);
		}
		public bool IsConfirmed { get; set; } // is this wallet confirmed, used when being a confirmed Creator 


		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PrivateMnemonicEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commission payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }


		private string replaceEmptyWithNull(string value)
		{
			// replace empty string with null to make field optional
			return string.IsNullOrEmpty(value) ? null : value;
		}
	}
}