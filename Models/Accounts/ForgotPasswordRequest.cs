using System.ComponentModel.DataAnnotations;

namespace Niftified.Models.Accounts
{
	public class ForgotPasswordRequest
	{
		[Required]
		[EmailAddress]
		public string Email { get; set; }
	}
}