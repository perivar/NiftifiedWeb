using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class UpdatePersonRequest
	{
		private string _status;
		private string _type;

		// section for information used for the blockchain 
		public string UniqueId { get; set; } // hash
		public string PublicKey { get; set; }
		public string PrivateKeyEncrypted { get; set; }
		public string BlockchainAddress { get; set; } // where to send commision payments to?

		public string Alias { get; set; } // might not want to use name, only hash

		public int AccountId { get; set; }

		[EnumDataType(typeof(Status))]
		public string Status
		{
			get => _status;
			set => _status = replaceEmptyWithNull(value);
		}

		[EnumDataType(typeof(PersonType))]
		public string Type
		{
			get => _type;
			set => _type = replaceEmptyWithNull(value);
		} // creator, co-creator?

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		public double SalesCommisionShare { get; set; }

		public List<int> WalletIds { get; set; }

		private string replaceEmptyWithNull(string value)
		{
			// replace empty string with null to make field optional
			return string.IsNullOrEmpty(value) ? null : value;
		}

	}
}