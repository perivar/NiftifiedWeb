using System.ComponentModel.DataAnnotations;

namespace Niftified.Models.Accounts
{
	public class ValidateResetTokenRequest
	{
		[Required]
		public string Token { get; set; }
	}
}