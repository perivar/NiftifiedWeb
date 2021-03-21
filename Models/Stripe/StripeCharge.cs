namespace Niftified.Models.Stripe
{
	public class StripeCharge
	{
		public int AccountId { get; set; }
		public string TokenId { get; set; }
		public string ProductName { get; set; }
		public long Amount { get; set; }
		public string Currency { get; set; } // lowercase
		public string ReceiptEmail { get; set; }
	}
}