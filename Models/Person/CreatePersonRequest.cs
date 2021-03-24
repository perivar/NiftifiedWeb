using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Persons
{
	public class CreatePersonRequest
	{
		[Required]
		public string Alias { get; set; } // if not an creator, might not want to use this to remain anynomous, only hash
		public bool IsAnonymous { get; set; } // don't show any information that might give this person away

		[Required]
		public int AccountId { get; set; }

		[EnumDataType(typeof(Status))]
		public string Status { get; set; }
		public bool IsConfirmed { get; set; } // is this person confirmed, used when being a confirmed Creator 
		public List<int> WalletIds { get; set; }


		// section for information used for the blockchain 
		// private and protected key
		public string PrivateKeyEncrypted { get; set; }
		public string PrivateKeyWIFEncrypted { get; set; }
		public string PublicAddress { get; set; } // where to send commission payments to?
		public string PublicKey { get; set; }
		public string PublicKeyHash { get; set; }

	}
}