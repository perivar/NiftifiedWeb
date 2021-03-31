/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable react/jsx-key */
import React from 'react';
import { useTable, usePagination } from 'react-table';
import { usePagination as useMyPagination } from '../_common/hooks/react-pagination-hook';

// check https://dev.to/uguremirmustafa/server-side-paginated-react-table-23p2

function Table({ columns, data, currentpage, setPage, perPage, setPerPage, totalPage }: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // canPreviousPage,
    // canNextPage,
    pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    // Get the state from the instance
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      // useControlledState: (state) => {
      //   return React.useMemo(
      //     () => ({
      //       ...state,
      //       pageIndex: currentpage
      //     }),
      //     [state, currentpage]
      //   );
      // },
      initialState: { pageIndex: currentpage }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: totalPage
    },
    usePagination
  );

  const { activePage, visiblePieces } = useMyPagination({
    initialPage: pageIndex,
    numberOfPages: totalPage,
    maxButtons: 5,
    alwaysUsePreviousNextButtons: false
  });

  return (
    <>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              perPage,
              totalPage,
              activePage,
              visiblePieces
            },
            null,
            2
          )}
        </code>
      </pre> */}
      <table {...getTableProps()} className="table table-sm">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentpage === 1 && 'disabled'}`}>
            <button
              className="page-link"
              type="button"
              onClick={() => {
                setPage(1);
              }}>
              First
            </button>
          </li>

          {visiblePieces.map((visiblePiece: any, index: number) => {
            const key = `${visiblePiece.type}-${index}`;

            if (visiblePiece.type === 'ellipsis') {
              return (
                <li key={key} className="page-item disabled">
                  <button className="page-link" type="button">
                    &hellip;
                  </button>
                </li>
              );
            }

            const { pageNumber } = visiblePiece;
            if (visiblePiece.type === 'page-number') {
              const isActive = pageNumber === activePage;
              const className = isActive ? 'active' : '';

              return (
                <li key={key} className={`page-item ${className}`}>
                  <button
                    className="page-link"
                    type="button"
                    aria-label={`Goto page ${pageNumber}`}
                    onClick={() => {
                      setPage(pageNumber);
                    }}>
                    {pageNumber}
                  </button>
                </li>
              );
            }

            if (visiblePiece.type === 'previous') {
              return (
                <li key={key} className={`page-item ${currentpage === 1 && 'disabled'}`}>
                  <button
                    className="page-link"
                    type="button"
                    onClick={() => {
                      setPage(pageNumber);
                    }}>
                    Previous
                  </button>
                </li>
              );
            }
            if (visiblePiece.type === 'next') {
              return (
                <li key={key} className={`page-item ${currentpage === totalPage && 'disabled'}`}>
                  <button
                    className="page-link"
                    type="button"
                    onClick={() => {
                      setPage(pageNumber);
                    }}>
                    Next
                  </button>
                </li>
              );
            }

            return ''; // have to return empty string not <></> since this will trigger a warning due to missing key
          })}
          <li className={`page-item ${currentpage === totalPage && 'disabled'}`}>
            <button
              className="page-link"
              type="button"
              onClick={() => {
                setPage(totalPage);
              }}>
              Last
            </button>
          </li>
        </ul>
      </nav>
      <div className="form-inline">
        <span className="mr-1">
          Page
          <strong className="ml-1">
            {pageIndex} of {pageOptions.length}
          </strong>
        </span>
        {/* <span>
          | Go to page:
          <input
            className="ml-1 mr-1 form-control form-control-sm w-auto"
            type="number"
            defaultValue={pageIndex}
            min="1"
            max={totalPage}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 1;
              setPage(page);
            }}
          />
        </span> */}
        <label className="ml-2">
          Show
          <select
            className="ml-1 mr-1 form-control form-control-sm w-auto"
            aria-label="Select number per page"
            value={perPage}
            onChange={(e) => {
              // setPageSize(Number(e.target.value));
              setPerPage(Number(e.target.value));
            }}>
            {[5, 10, 20].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          Rows
        </label>
      </div>
    </>
  );
}

export default Table;
