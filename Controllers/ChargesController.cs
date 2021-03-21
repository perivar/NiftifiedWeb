using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using Niftified.Services;
using Stripe;
using Niftified.Models.Stripe;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Niftified.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ChargesController : BaseController
	{
		public readonly IOptions<StripeOptions> _options;
		private readonly INiftyService _niftyService;

		public ChargesController(
			INiftyService niftyService,
			IOptions<StripeOptions> options)
		{
			_niftyService = niftyService;
			_options = options;
		}

		[HttpPost("/api/charges/createcharge")]
		public ActionResult<CardPaymentReceiptModel> CreateCharge([FromForm] StripeCharge createOptions)
		{
			// check raw parameters
			// var form = Request.Form;
			// var createOptions = new StripeCharge();

			var paymentTransactionId = Guid.NewGuid().ToString();

			var options = new ChargeCreateOptions
			{
				TransferGroup = paymentTransactionId,
				Amount = createOptions.Amount,
				Currency = createOptions.Currency,
				Description = createOptions.ProductName,
				Source = createOptions.TokenId,
				ReceiptEmail = createOptions.ReceiptEmail
			};

			var service = new ChargeService();
			try
			{
				var charge = service.Create(options);
				return Ok(ToPaymentReceipt(charge));
			}
			catch (System.Exception e)
			{
				return BadRequest(e.Message);
			}
		}

		private CardPaymentReceiptModel ToPaymentReceipt(Charge charge)
		{
			var cardPaymentReceiptViewModel = new CardPaymentReceiptModel
			{
				Amount = charge.Amount,
				Currency = charge.Currency,
				Description = charge.Description,
				Status = charge.Status,
				Created = charge.Created,
				BalanceTransactionId = charge.BalanceTransactionId,
				Id = charge.Id,
				SourceId = charge.Source.Id,

			};

			return cardPaymentReceiptViewModel;
		}

		[HttpPost("/api/charges/create-payment-intent")]
		public ActionResult<CardPaymentReceiptModel> CreatePaymentIntent([FromBody] PaymentIntent createOptions)
		{
			// check raw parameters
			// var form = Request.Form;

			// TODO: get the price and currency from the server to avoid
			// client tampering
			// var productDetails = getProductDetails();

			var paymentTransactionId = Guid.NewGuid().ToString();

			var options = new PaymentIntentCreateOptions
			{
				TransferGroup = paymentTransactionId,
				Amount = createOptions.Amount,
				Currency = createOptions.Currency,
				Description = createOptions.Description,
				ReceiptEmail = createOptions.ReceiptEmail,
				PaymentMethodTypes = _options.Value.PaymentMethodTypes
			};

			var service = new PaymentIntentService();
			try
			{
				var paymentIntent = service.Create(options);
				return Ok(paymentIntent);
			}
			catch (System.Exception e)
			{
				return BadRequest(e.Message);
			}
		}

		[HttpPost("/api/charges/webhook")]
		public async Task<IActionResult> Webhook()
		{
			var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
			Event stripeEvent;
			try
			{
				stripeEvent = EventUtility.ConstructEvent(
					json,
					Request.Headers["Stripe-Signature"],
					_options.Value.WebhookSecret
				);
				Console.WriteLine($"Webhook notification with type: {stripeEvent.Type} found for {stripeEvent.Id}");
			}
			catch (Exception e)
			{
				Console.WriteLine($"Something failed {e}");
				return BadRequest();
			}

			// Handle the event
			if (stripeEvent.Type == Events.PaymentIntentSucceeded)
			{
				var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
				Console.WriteLine("Payment Intent succesfull: ", paymentIntent.ToJson());
				// Then define and call a method to handle the successful payment intent.
				// handlePaymentIntentSucceeded(paymentIntent);
			}
			else if (stripeEvent.Type == Events.PaymentMethodAttached)
			{
				var paymentMethod = stripeEvent.Data.Object as PaymentMethod;
				Console.WriteLine("Payment Intent failed: ", paymentMethod.ToJson());
				// Then define and call a method to handle the successful attachment of a PaymentMethod.
				// handlePaymentMethodAttached(paymentMethod);
			}
			// ... handle other event types
			else
			{
				// Unexpected event type
				Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
			}
			return Ok();
		}

	}
}
