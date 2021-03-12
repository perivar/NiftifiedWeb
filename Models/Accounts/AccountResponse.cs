using System;

namespace Niftified.Models.Accounts
{
	public class AccountResponse
	{
		public int Id { get; set; }
		public string LanguageCode { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Role { get; set; }
		public DateTime Created { get; set; }
		public DateTime? Updated { get; set; }
		public bool IsVerified { get; set; }
	}
}