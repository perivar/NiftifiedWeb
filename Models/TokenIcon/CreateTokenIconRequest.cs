using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Tags
{
	public class CreateTokenIconRequest
	{
		[Required]
		public IFormFile TokenIcon { get; set; }

		[Required]
		public string TokenId { get; set; }

		public string Email { get; set; }
		public string TokenName { get; set; }
		public string TokenSymbol { get; set; }
		public int Decimals { get; set; }
		public string DocumentUri { get; set; }
		public int Amount { get; set; }
		public bool FixedSupply { get; set; }
	}
}