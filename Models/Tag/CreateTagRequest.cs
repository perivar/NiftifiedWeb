using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Niftified.Entities;

namespace Niftified.Models.Accounts
{
	public class CreateTagRequest
	{
		[Required]
		public string LanguageCode { get; set; } // what language
		[Required]
		public string Name { get; set; }

		public string Description { get; set; }
	}
}