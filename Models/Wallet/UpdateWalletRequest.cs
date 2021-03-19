using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class UpdateWalletRequest
	{
		private string _type;

		public int PersonId { get; set; } // must be owned by a person

		public string Name { get; set; }


		[EnumDataType(typeof(WalletType))]
		public string Type
		{
			get => _type;
			set => _type = replaceEmptyWithNull(value);
		}

		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commision payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }


		private string replaceEmptyWithNull(string value)
		{
			// replace empty string with null to make field optional
			return string.IsNullOrEmpty(value) ? null : value;
		}

	}
}