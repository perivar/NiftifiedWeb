namespace Niftified.Helpers
{
	public class AppSettings
	{
		public string Secret { get; set; }

		// refresh token time to live (in days), inactive tokens are
		// automatically deleted from the database after this time
		public int RefreshTokenTTL { get; set; }

		public string EmailFrom { get; set; }
		public string SmtpHost { get; set; }
		public int SmtpPort { get; set; }
		public string SmtpUser { get; set; }
		public string SmtpPass { get; set; }

		// edition parameters
		public string StoredFilesPath { get; set; }
		public decimal DefaultSalesCommissionToCreators { get; set; }
		public decimal DefaultSalesCommissionToBlockchain { get; set; }

		// windows.crypto only works in safe contexts (like localhost and https)
		// ignore this when testing in non https server settings
		public bool IgnoreWindowsCryptoHttpsRequirement { get; set; }
	}
}