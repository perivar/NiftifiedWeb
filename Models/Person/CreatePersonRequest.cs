using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreatePersonRequest
	{
		public string UniqueId { get; set; } //+ hash

		[Required]
		public string Alias { get; set; } // might not want to use name, only hash

		[Required]
		public int AccountId { get; set; }

		[EnumDataType(typeof(Status))]
		public string Status { get; set; }

		[EnumDataType(typeof(PersonType))]
		public string Type { get; set; } // creator, co-creator?

		// note that all commisions for co-creators cannot exceed 100%
		// defaults to 100% of the sales commision defined in the Edition
		public double SalesCommisionShare { get; set; }

		public List<int> WalletIds { get; set; }
	}
}