import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Table from '../../_components/Table';
import { niftyService } from '../../_services';

export enum VolumeType {
  Auction,
  FixedPrice
}

export enum VolumeStatus {
  Pending, // not yet minted
  ForSale, // ready to be sold
  NotForSale // not set to be sold
}

// custom hook for volumes that support pagination
export default function useVolumes(id: number, page: number, perPage: number) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [volumes, setVolumes] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // load volumes async
  const fetchVolumes = (id: number, page: number, perPage: number) => {
    setLoading(true);

    niftyService
      .getVolumesByEditionId(id, page, perPage)
      .then((res) => {
        setTotalCount(res.key);
        setVolumes(res.value);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVolumes(id, page, perPage);
  }, [id, page, perPage]);

  return useMemo(
    () => ({
      volumes,
      isLoading,
      totalCount
    }),
    [volumes, isLoading, totalCount]
  );
}

export const ListVolumes = ({ match }: { match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  // default values for paging
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { volumes, totalCount, isLoading } = useVolumes(id, page, perPage);

  const numberOfPages = Math.ceil(totalCount / perPage);

  const [isLoadingEdition, setLoadingEdition] = useState<boolean>(false);
  const [edition, setEdition] = useState<any>([]);

  // load edition async
  React.useEffect(() => {
    setLoadingEdition(true);

    niftyService
      .getEditionById(id)
      .then((res) => {
        setEdition(res);
        setLoadingEdition(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingEdition(false);
      });
  }, [id]);

  const statusAccessor = (column: any) => {
    return VolumeStatus[column.status];
  };

  const typeAccessor = (column: any) => {
    return VolumeType[column.type];
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'editionNumber'
      },
      {
        Header: 'Status',
        accessor: statusAccessor
      },
      {
        Header: 'Start Price',
        accessor: 'amount'
      },
      {
        Header: 'Currency',
        accessor: 'currencyUniqueId'
      },
      {
        Header: 'Type',
        accessor: typeAccessor
      },
      {
        Header: 'Current Owner',
        accessor: 'owner.alias'
      }
    ],
    []
  );

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/edition/publish/${id}`}>
        Publish / Mint
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            {!isLoadingEdition && <h5>Showing volumes for {`${edition.name} - ${edition.description}`}</h5>}
            {!isLoading && (
              <div className="table-responsive">
                <Table
                  columns={columns}
                  data={volumes}
                  currentpage={page}
                  setPage={setPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                  totalPage={numberOfPages}></Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
