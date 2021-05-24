import React from 'react';

export const CreateFrontpage = () => {
  return (
    <div className="container">
      <div className="">
        <button type="button" className="btn btn-link">
          <div className="d-inline-flex">
            <div className="">
              <svg viewBox="0 0 14 12" fill="none" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.29436 0.292893C6.68488 -0.0976311 7.31805 -0.0976311 7.70857 0.292893C8.0991 0.683417 8.0991 1.31658 7.70857 1.70711L4.41568 5H12.9985C13.5508 5 13.9985 5.44772 13.9985 6C13.9985 6.55228 13.5508 7 12.9985 7H4.41568L7.70857 10.2929C8.0991 10.6834 8.0991 11.3166 7.70857 11.7071C7.31805 12.0976 6.68488 12.0976 6.29436 11.7071L0.587252 6L6.29436 0.292893Z"
                  fill="currentColor"></path>
              </svg>
            </div>
            <span className="ml-2">Go back</span>
          </div>
        </button>
        <div className="h2">
          <span className="">Create collectible</span>
        </div>
        <div className="">
          <span className="">
            Choose “Single” if you want your collectible to be one of a kind or “Multiple” if you want to sell one
            collectible multiple times
          </span>
        </div>
        <div className="container p-4">
          <div className="card-deck flex-row flex-nowrap">
            <a href="/create/erc721" className="card" data-marker="root/appPage/create/chooseTokenType/create721Button">
              <button type="button" className="btn card-body">
                <div className="">
                  <div className="">
                    <img
                      alt="single"
                      src="https://rarible.com/static/2a78e39400f51f1dbeba13832f421092.png"
                      loading="lazy"
                      className="mb-2"
                      width="85px"
                      height="135px"
                    />
                  </div>
                </div>
                <span className="">Single</span>
              </button>
            </a>
            <a
              href="/create/erc1155"
              className="card"
              data-marker="root/appPage/create/chooseTokenType/create1155Button">
              <button type="button" className="btn card-body">
                <div className="">
                  <div className="">
                    <img
                      alt="multiple"
                      src="https://rarible.com/static/48dc30c106da96755b60ead8627c8888.png"
                      loading="lazy"
                      className="mb-2"
                      width="85px"
                      height="135px"
                    />
                  </div>
                </div>
                <span className="">Multiple</span>
              </button>
            </a>
          </div>
        </div>
        <div className="">
          <span className="">
            We do not own your private keys and cannot access your funds without your confirmation
          </span>
        </div>
      </div>
    </div>
  );
};
