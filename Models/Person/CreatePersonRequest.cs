using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Persons
{
	public class CreatePersonRequest
	{
		public string Alias { get; set; } // if not an creator, might not want to use this to remain anynomous, only hash
		public bool IsAnonymous { get; set; } // don't show any information that might give this person away

		[Required]
		public int AccountId { get; set; }

		[EnumDataType(typeof(Status))]
		public string Status { get; set; }

		[EnumDataType(typeof(PersonType))]
		public string Type { get; set; } // creator, co-creator?

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		[Required]
		public double SalesCommisionShare { get; set; }

		public List<int> WalletIds { get; set; }


		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commision payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }

	}
}