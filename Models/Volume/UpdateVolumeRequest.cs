using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class UpdateVolumeRequest
	{
		private string _status;
		private string _type;

		public string HashId { get; set; } // connection to nifty chain
		public string ExternalHashId { get; set; } // id on external block chain?

		[Required]
		public int OwnerId { get; set; }

		[EnumDataType(typeof(VolumeStatus))]
		public string Status
		{
			get => _status;
			set => _status = replaceEmptyWithNull(value);
		}

		[EnumDataType(typeof(VolumeType))]
		public string Type
		{
			get => _type;
			set => _type = replaceEmptyWithNull(value);
		}

		public decimal Amount { get; set; } // Initial amount for auctions or the selling price for fixed price sales

		[Required]
		public string CurrencyUniqueId { get; set; }

		// An 'edition' of a print is a limited set of identical prints made from the same plate. 
		// Editioned prints must be identical. 
		[Required]
		public int EditionId { get; set; } // reference that connects several items into one bacth

		// volume of the edition in the print number (e.g. "15/30" for the 15th print in an edition of 30). 
		[Required]
		public int EditionNumber { get; set; } // e.g. number 15 of 30

		private string replaceEmptyWithNull(string value)
		{
			// replace empty string with null to make field optional
			return string.IsNullOrEmpty(value) ? null : value;
		}
	}
}