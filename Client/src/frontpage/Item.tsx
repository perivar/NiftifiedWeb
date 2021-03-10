import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// import { accountService } from '../_services';

export interface ItemProps {
  path: string;
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

  const { path } = props;
  const { id } = props;
  const { title } = props;
  const { creator } = props;
  const { group } = props;
  const { type } = props;
  const { stock } = props;
  const { bids } = props;
  const { image } = props;

  const [isLiking, setIsLiking] = useState<boolean>(false);
  const handleLikeClick = () => {
    setIsLiking(!isLiking);
  };

  return (
    <div className="card" data-groups={group}>
      <div className="row">
        <div className="col">
          <div className="item-title">
            {title} - {creator}
          </div>
          <div className="item-type">
            {type} <div className="item-type-stock">{stock} in stock</div>
          </div>
          <div className="item-bid">
            Bids from: <div className="item-bid-amount">{bids} NFYs</div>
          </div>
        </div>
        <div className="col text-right">
          <div className="item-like">
            <i
              className={`far fa-heart ${isLiking ? 'item-like-selected' : ''}`}
              onClick={handleLikeClick}
              role="button"
              tabIndex={0}
            />
            <div>
              <button className="btn btn-primary btn-sm mt-1">Place a bid</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Link to={`${path}/detail/${id}`}>
            <figure className="pp-effect">
              <img className="img-fluid" src={image} alt="{title}" />
              <figcaption>
                <div className="h4">{title}</div>
                <p>{creator}</p>
              </figcaption>
            </figure>
          </Link>
        </div>
      </div>
    </div>
  );
};
