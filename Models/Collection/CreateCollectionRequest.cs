using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreateCollectionRequest
	{
		[Required]
		public string LanguageCode { get; set; }

		[Required]
		public int AccountId { get; set; }

		[Required]
		public string Name { get; set; }

		public string Description { get; set; }
		public int Year { get; set; }
	}
}