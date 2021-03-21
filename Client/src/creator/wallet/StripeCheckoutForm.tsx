import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { chargeService, accountService, alertService } from '../../_services';
import { PaymentIntent, StripeCardElementOptions } from '@stripe/stripe-js';
import { ProductList, Product } from './types';

export const StripeCheckoutForm = ({ productList }: { productList: ProductList | undefined }) => {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PaymentIntent | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const user = accountService.userValue;

  useEffect(() => {
    // TODO: Step 1: Fetch product details such as amount and currency from
    // API to make sure it can't be tampered with in the client.
    // chargeService.getProductDetails().then((productDetails) => {
    //   setAmount(productDetails.amount / 100);
    //   setCurrency(productDetails.currency);
    // });

    // for now use the passed list
    if (productList && productList.products) {
      // Step 2: Create PaymentIntent over Stripe API
      chargeService
        .createPaymentIntent({
          amount: productList.totalToPay * 100,
          currency: productList.currency,
          description: productList.description,
          receiptEmail: user.email
        })
        .then((clientSecret) => {
          setClientSecret(clientSecret);
        })
        .catch((err) => {
          setError(err.message);
        });
      setAmount(productList.totalToPay);
      setCurrency(productList.currency);
    }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    // has not yet received a client secret
    if (!clientSecret) {
      return;
    }

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as any,
        billing_details: {
          name: event.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.log('[error]', payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      setMetadata(payload.paymentIntent);
      console.log('[PaymentIntent]', payload.paymentIntent);
    }
  };

  const renderSuccess = () => {
    return (
      <div className="alert alert-success">
        <h1>Your test payment succeeded</h1>
        <p>View PaymentIntent response:</p>
        <pre className="sr-callout">
          <code>{JSON.stringify(metadata, null, 2)}</code>
        </pre>
      </div>
    );
  };

  const CARD_OPTIONS: StripeCardElementOptions = {
    hidePostalCode: true,
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#000000',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#fce883'
        },
        '::placeholder': {
          color: '#87bbfd'
        }
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee'
      }
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <h1>
          {currency.toLocaleUpperCase()}{' '}
          {amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2
          })}{' '}
        </h1>
        <h4>Pre-order the Pasha package</h4>

        <div className="form-group">
          <div className="row">
            <input type="text" id="name" name="name" placeholder="Name" autoComplete="name" className="form-control" />
          </div>

          <div className="row">
            <CardElement className="form-control" options={CARD_OPTIONS} />
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary" disabled={processing || !clientSecret || !stripe}>
          {processing ? 'Processing…' : 'Pay'}
        </button>
      </form>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        {succeeded ? renderSuccess() : renderForm()}
      </div>
    </div>
  );
};
