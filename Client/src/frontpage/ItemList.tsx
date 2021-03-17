import React from 'react';
import { Item, ItemProps } from './Item';

function ItemList({ match }: { match: any }) {
  const { path } = match;

  const items: ItemProps[] = [];
  items.push({
    path,
    id: '1',
    creator: 'Anette Moi',
    title: 'Bryne',
    group: 'Art',
    type: 'Auction',
    stock: '56',
    bids: '5.55',
    image: '/nifty-images/nfy-1.png'
  });
  items.push({
    path,
    id: '2',
    creator: 'Anette Moi',
    title: 'Dogs',
    group: 'Art',
    type: 'Auction',
    stock: '10',
    bids: '23.14',
    image: '/nifty-images/nfy-2.png'
  });
  items.push({
    path,
    id: '3',
    creator: 'Anette Moi',
    title: 'Inkassovarsel',
    group: 'Art',
    type: 'Not for sale',
    stock: '3',
    bids: '55.14',
    image: '/nifty-images/nfy-3.png'
  });
  items.push({
    path,
    id: '4',
    creator: 'Anette Moi',
    title: 'Kikutstua',
    group: 'Art',
    type: 'Not for sale',
    stock: '10',
    bids: '56.17',
    image: '/nifty-images/nfy-4.png'
  });
  items.push({
    path,
    id: '5',
    creator: 'Anette Moi',
    title: 'Fuck It',
    group: 'Art',
    type: 'Auction',
    stock: '100',
    bids: '200.5',
    image: '/nifty-images/nfy-5.png'
  });
  items.push({
    path,
    id: '6',
    creator: 'CryptoPunks',
    title: 'Eric 5',
    group: 'Art',
    type: 'Auction',
    stock: '1',
    bids: '20506',
    image: '/nifty-images/nfy-6.png'
  });
  items.push({
    path,
    id: '7',
    creator: 'CryptoPunks',
    title: 'Tom 4',
    group: 'Art',
    type: 'Auction',
    stock: '1',
    bids: '4026',
    image: '/nifty-images/nfy-7.png'
  });
  items.push({
    path,
    id: '8',
    creator: 'Julian',
    title: 'Invaders',
    group: 'Art',
    type: 'Auction',
    stock: '1',
    bids: '1026',
    image: '/nifty-images/nfy-8.png'
  });
  items.push({
    path,
    id: '9',
    creator: 'Julian',
    title: 'Invaders are here',
    group: 'Art',
    type: 'Auction',
    stock: '1',
    bids: '3021',
    image: '/nifty-images/nfy-9.png'
  });

  return (
    <>
      <div className="container pp-section">
        <div className="row">
          <div className="col-md-9 col-sm-12 px-0">
            <h1 className="h4">Collect and create Nifties - crypto protected digital art / music / sound</h1>
          </div>
        </div>
      </div>

      <div className="container px-0 py-4">
        {/* <div className="pp-category-filter">
          <div className="row">
            <div className="col-sm-12">
              <a className="btn btn-primary pp-filter-button" href="#" data-filter="all">
                All
              </a>
              <a className="btn btn-outline-primary pp-filter-button" href="#" data-filter="people">
                People
              </a>
              <a className="btn btn-outline-primary pp-filter-button" href="#" data-filter="nature">
                Nature
              </a>
              <a className="btn btn-outline-primary pp-filter-button" href="#" data-filter="computer">
                Computer
              </a>
              <a className="btn btn-outline-primary pp-filter-button" href="#" data-filter="food">
                Food
              </a>
            </div>
          </div>
        </div> */}
      </div>
      <div className="container px-0">
        <div className="pp-gallery">
          <div className="card-columns">
            {items &&
              items.map((item: ItemProps, index: number) => (
                <Item
                  key={index}
                  path={path}
                  id={item.id}
                  creator={item.creator}
                  title={item.title}
                  group={item.group}
                  type={item.type}
                  stock={item.stock}
                  bids={item.bids}
                  image={item.image}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export { ItemList };
