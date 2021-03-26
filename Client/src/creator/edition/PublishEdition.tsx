import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import { StripeCheckoutForm } from '../wallet/StripeCheckoutForm';
import { ProductList, Product } from '../wallet/types';

export const PublishEdition = ({ match }: { match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [edition, setEdition] = useState<any>([]);
  const [productList, setProductList] = useState<ProductList>();

  // load edition async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getEditionById(id)
      .then((res) => {
        setEdition(res);
        setLoading(false);

        // map to products
        // if array
        // const products = res.map((e: any) => {
        //   const product: Product = { name: e.name, quantity: 1, unitPrice: 45.1 };
        //   return product;
        // });
        // if single
        const product: Product = {
          name: res.name,
          dataSourceFileName: res.dataSourceFileName,
          quantity: res.volumeCount,
          unitPrice: 0.5
        };
        const products = [product];

        // calculate subtotal and total to pay
        let subTotal = 0;
        products.forEach((p) => {
          const calculation = p.quantity * p.unitPrice;
          subTotal += calculation;
        });

        const deliveryCost = 0;
        const totalToPay = subTotal + deliveryCost;

        const description = products
          .map((p) => {
            return p.name;
          })
          .join(' ');

        // create return list
        const prodList: ProductList = {
          deliveryCost,
          products,
          currency: 'nok',
          subTotal,
          totalToPay,
          description
        };
        setProductList(prodList);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/volumes/${id}`}>
        Volumes
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Publish and mint you edition and volumes</h4>
            {!isLoading && edition && productList && <StripeCheckoutForm productList={productList} />}
          </div>
        </div>
      </div>
    </>
  );
};
