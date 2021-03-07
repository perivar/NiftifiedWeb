import React, { useState } from 'react';
import { Badge, Nav, ListGroup, Alert } from 'react-bootstrap';

// import { accountService } from '../_services';

const Content = ({ tab }: { tab: string | null }) => {
  const InfoContent = () => {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item>Owner lakshepassion </ListGroup.Item>
        <ListGroup.Item>
          Creator lakshepassion <Alert variant="info">10% of sales will go to creator</Alert>
        </ListGroup.Item>
        <ListGroup.Item>Collection</ListGroup.Item>
      </ListGroup>
    );
  };
  const OwnersContent = () => {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item>1 edition available for offers lakshepassion</ListGroup.Item>
      </ListGroup>
    );
  };
  const HistoryContent = () => {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item>Offer cancelled 5 hours ago by 0xb52e2dbf7...ae06 </ListGroup.Item>
        <ListGroup.Item>Offered 1.5 WETH for 1 edition 10 hours ago by 0xb52e2dbf7...ae06 </ListGroup.Item>
        <ListGroup.Item>Offer cancelled 12 hours ago by 0x9fd2f92b9...3600 </ListGroup.Item>
        <ListGroup.Item>Offered 1.25 WETH for 1 edition 1 days ago by C.Camaro </ListGroup.Item>
        <ListGroup.Item>Offered 1.01 WETH for 1 edition 1 days ago by 0x9fd2f92b9...3600 </ListGroup.Item>
        <ListGroup.Item>Offer cancelled 1 days ago by 0x54ec6aa23...0be4 </ListGroup.Item>
        <ListGroup.Item>Offered 1 WETH for 1 edition 1 days ago by 0x2ace7105b...345c </ListGroup.Item>
        <ListGroup.Item>Offered 0.3 WETH for 1 edition 1 days ago by 0x54ec6aa23...0be4 </ListGroup.Item>
        <ListGroup.Item>Minted 1 days ago by lakshepassion</ListGroup.Item>
      </ListGroup>
    );
  };
  const BidsContent = () => {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item>1.5 WETH expired by 0xb52e2dbf7...ae06</ListGroup.Item>
        <ListGroup.Item>1.25 WETH by C.Camaro</ListGroup.Item>
        <ListGroup.Item>1.01 WETH expired by 0x9fd2f92b9...3600</ListGroup.Item>
        <ListGroup.Item>1 WETH by 0x2ace7105b...345c</ListGroup.Item>
        <ListGroup.Item>0.3 WETH expired by 0x54ec6aa23...0be4</ListGroup.Item>
      </ListGroup>
    );
  };

  switch (tab) {
    default:
    case 'link-info':
      return <InfoContent />;
    case 'link-owners':
      return <OwnersContent />;
    case 'link-history':
      return <HistoryContent />;
    case 'link-bids':
      return <BidsContent />;
  }
};

function ItemDetail({ match }: { match: any }) {
  const { params } = match;
  const { id } = params;

  const creator = 'Anette Moi';
  const title = 'Bryne';
  const group = 'Art';
  const type = 'Auction';
  const stock = '56';
  const bids = '5.55';
  const image = '/nifty-images/nfy-1.png';

  const [tab, setTab] = useState<string | null>(null);

  const handleSelect = (eventKey: string | null) => {
    setTab(eventKey);
  };

  return (
    <>
      <div className="row mt-5 mb-5">
        <div className="col">
          <img className="img-fluid" src={image} alt="" />
        </div>
        <div className="col">
          <Badge variant="secondary mr-2">{group}</Badge>
          <Badge variant="secondary mr-2">{creator}</Badge>
          <div className="h3">
            {creator} - {title}
          </div>
          <div className="item-type">
            {type} <div className="item-type-stock">{stock} in stock</div>
          </div>
          <div className="mb-2">Highest bid by 0xb52e2dbf7...ae06</div>
          <div className="mb-2">
            <div className="h3">{bids} NFYs</div>
          </div>
          <div className="mb-2">
            <button className="btn btn-primary btn-lg mb-3">Place a bid</button>
          </div>
          <div className="h6 mb-2">Don't be afraid, my dear... We are gonna live Forever! by Lakshepassion 1/1</div>
          <Nav className="mt-3" fill variant="tabs" defaultActiveKey="link-info" onSelect={handleSelect}>
            <Nav.Item>
              <Nav.Link eventKey="link-info">Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-owners">Owners</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-history">History</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-bids">Bids</Nav.Link>
            </Nav.Item>
          </Nav>
          <Content tab={tab} />
        </div>
      </div>
    </>
  );
}

export { ItemDetail };
