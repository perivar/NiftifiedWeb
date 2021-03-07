using System.ComponentModel.DataAnnotations;

namespace Niftified.Models.Accounts
{
	public class VerifyEmailRequest
	{
		[Required]
		public string Token { get; set; }
	}
}