using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Niftified.Entities;

namespace Niftified.Models.Tags
{
	public class CreateFileRequest
	{
		[Required]
		public IFormFile File { get; set; }

		public string tokenId { get; set; }
	}
}