import React from 'react';

// import { accountService } from '../_services';

export interface ItemProps {
  id: string;
  creator: string;
  title: string;
  group: string;
  type: string;
  stock: string;
  bids: string;
  image: string;
}

export const Item = (props: ItemProps) => {
  // const user = accountService.userValue;

  const { id } = props;
  const { title } = props;
  const { creator } = props;
  const { group } = props;
  const { type } = props;
  const { stock } = props;
  const { bids } = props;
  const { image } = props;

  return (
    <div className="card" data-groups={group}>
      <div className="item-title">
        {creator} - {title}
      </div>
      <div className="item-type">
        {type} <div className="item-type-stock">{stock} in stock</div>
      </div>
      <div className="item-bid">
        Bids from: <div className="item-bid-amount">{bids} NFYs</div>
      </div>
      <a href={`/detail/${id}`}>
        <figure className="pp-effect">
          <img className="img-fluid" src={image} alt="{title}" />
          <figcaption>
            <div className="h4">{title}</div>
            <p>{creator}</p>
          </figcaption>
        </figure>
      </a>
    </div>
  );
};
