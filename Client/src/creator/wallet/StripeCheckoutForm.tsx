import React, { useEffect, useState } from 'react';
import { PaymentIntent, StripeCardElementOptions } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { chargeService, accountService, alertService } from '../../_services';
import { ProductList, Product } from './types';

// read from .env files
const config = { storedFilesPath: process.env.REACT_APP_STORED_FILES_PATH };

// import './stripe_styles.scss';

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

const CardField = ({ onChange }: { onChange: any }) => (
  <div className="form-group">
    <CardElement className="form-control" options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  required: boolean;
  autoComplete: string;
  value: string;
  onChange: any;
}) => (
  <div className="form-group">
    <label htmlFor={id} className="form-row">
      {label}
    </label>
    <input
      className="form-control"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SubmitButton = ({
  processing,
  error,
  children,
  disabled
}: {
  processing: any;
  error: any;
  children: any;
  disabled: any;
}) => (
  <button className={`btn ${error ? 'btn-danger' : 'btn-primary'}`} type="submit" disabled={processing || disabled}>
    {processing ? 'Processing...' : children}
  </button>
);

const ErrorMessage = ({ children }: { children: any }) => (
  <div className="ErrorMessage" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const ResetButton = ({ onClick }: { onClick: any }) => (
  <button type="button" className="btn btn-secondary" onClick={onClick}>
    <svg width="32px" height="32px" viewBox="0 0 32 32">
      <path
        fill="#FFF"
        d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
      />
    </svg>
  </button>
);

export const StripeCheckoutForm = ({ productList }: { productList: ProductList | undefined }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PaymentIntent | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState<any>({
    email: '',
    name: ''
  });

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
          amount: productList.totalToPay * 100, // TODO: must be the smallest denominator in the currency used
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
    }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement('card')!.focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    // has not yet received a client secret
    if (!clientSecret) {
      return;
    }

    // Step 3: Use clientSecret from PaymentIntent and the CardElement
    // to confirm payment with stripe.confirmCardPayment()
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as any,
        // billing_details: {
        //   name: event.target.name.value
        // }
        billing_details: billingDetails
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
        <h3>Your test payment succeeded</h3>
        <p>PaymentIntent response:</p>
        <pre>
          <code>{JSON.stringify(metadata, null, 2)}</code>
        </pre>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="m-0 pt-2 pb-2">
                      <strong>Order Summary</strong>
                    </h6>
                  </div>
                  <div className="card-body">
                    {productList && productList.products ? (
                      <>
                        <p>{productList.products.length} items</p>

                        {productList.products.map((p: Product) => (
                          <>
                            <div className="row">
                              <div className="col-4 align-self-center">
                                <img
                                  alt={p.name}
                                  className="img-fluid"
                                  src={`${config.storedFilesPath}/${p.dataSourceFileName}`}></img>
                              </div>
                              <div className="col-8">
                                <div className="row">
                                  <b>
                                    {productList.currency.toLocaleUpperCase()}{' '}
                                    {p.unitPrice.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                                  </b>
                                </div>
                                <div className="row text-muted">{p.name}</div>
                                <div className="row">Qty: {p.quantity}</div>
                              </div>
                            </div>
                          </>
                        ))}
                        <hr />
                        <div className="row">
                          <div className="col text-left">Subtotal</div>
                          <div className="col text-right">
                            {productList.currency.toLocaleUpperCase()}{' '}
                            {productList.subTotal.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col text-left">Delivery</div>
                          <div className="col text-right">
                            {productList.deliveryCost !== 0
                              ? productList.deliveryCost.toLocaleString(navigator.language, {
                                  minimumFractionDigits: 2
                                })
                              : 'Free'}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col text-left">
                            <b>Total to pay</b>
                          </div>
                          <div className="col text-right">
                            <b>
                              {productList.currency.toLocaleUpperCase()}{' '}
                              {productList.totalToPay.toLocaleString(navigator.language, { minimumFractionDigits: 2 })}
                            </b>
                          </div>
                        </div>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <form className="form" onSubmit={handleSubmit}>
                  <div className="card">
                    <div className="card-header">
                      <div className="row">
                        <div className="col-md-6 pt-2">
                          <h6 className="m-0">
                            <strong>Payment Details</strong>
                          </h6>
                        </div>
                        <div className="col-md text-right">
                          <i className="fab mr-1 fa-cc-visa fa-2x" aria-hidden="true"></i>
                          <i className="fab mr-1 fa-cc-mastercard fa-2x" aria-hidden="true"></i>
                          <i className="fab fa-cc-amex fa-2x" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <fieldset className="form-group">
                        <Field
                          label="Card Owner"
                          id="name"
                          type="text"
                          placeholder="Jane Doe"
                          required
                          autoComplete="name"
                          value={billingDetails.name}
                          onChange={(e: any) => {
                            setBillingDetails({ ...billingDetails, name: e.target.value });
                          }}
                        />
                      </fieldset>
                      <fieldset className="form-group">
                        <Field
                          label="Email"
                          id="email"
                          type="text"
                          placeholder="jane@doe.com"
                          required
                          autoComplete="email"
                          value={billingDetails.email}
                          onChange={(e: any) => {
                            setBillingDetails({ ...billingDetails, email: e.target.value });
                          }}
                        />
                      </fieldset>
                      <fieldset className="FormGroup">
                        <CardField
                          onChange={(e: any) => {
                            setError(e.error);
                            setCardComplete(e.complete);
                          }}
                        />
                      </fieldset>
                      {error && <ErrorMessage>{error}</ErrorMessage>}
                    </div>
                    <div className="card-footer">
                      <SubmitButton processing={processing} error={error} disabled={!stripe}>
                        Pay
                        {productList
                          ? ` ${productList.currency.toLocaleUpperCase()} ${productList.totalToPay.toLocaleString(
                              navigator.language,
                              { minimumFractionDigits: 2 }
                            )}`
                          : 0}
                      </SubmitButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{succeeded ? renderSuccess() : renderForm()}</>;
};
