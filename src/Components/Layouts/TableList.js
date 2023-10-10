import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useTable, useSortBy, useExpanded, usePagination } from "react-table";
import { Table, Row } from "reactstrap";
// import { Pagination } from "./Pagination";

export const TableList = ({
  columns,
  data,

  customPageSize,
  customTotalSize,
  customFetchData,
  tableClass,
  theadClass,
  thClass,
  divClass,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,

    state: { pageSize, totalSize },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      autoResetPage: false,
      pageCount: Math.ceil(customTotalSize / customPageSize),
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        totalSize: customTotalSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },

    useSortBy,
    useExpanded,
    usePagination
  );

  function range(start, stop, step) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  }

  const [pageIndex, setPageIndex] = useState(0);
  const [pagSkip, setPagSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [pageNumbers, setPageNumbers] = useState(range(1, 2, 1));

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const handlePagination = (pageIndex, action) => {
    if (pageIndex < 0 || pageIndex > Math.ceil(customTotalSize / pageSize)) {
      return;
    }

    if (action) {
      let pagSkipp = pagSkip + 2;

      if (action === "prev") {
        pagSkipp = pagSkip - 2;
      }

      setPagSkip(pagSkipp);

      if (pagSkipp < 0) return;

      let newPageNumbers = range(
        1,
        Math.ceil(customTotalSize / pageSize),
        1
      ).splice(pagSkipp, 2);
      setPageNumbers(newPageNumbers);
      setCurrentPage(newPageNumbers[0]);

      setPageIndex(pageIndex - 1);

      customFetchData({ pageSize, pageIndex: pageIndex - 1 });

      return;
    }

    setPageIndex(pageIndex);
    setCurrentPage(pageIndex);

    customFetchData({ pageIndex: pageIndex - 1, pageSize });
  };

  return (
    <Fragment>
      <div className="tabs">
        <div className={divClass}>
          <Table hover {...getTableProps()} className={tableClass}>
            <thead className={theadClass}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      className={thClass}
                      {...column.getSortByToggleProps()}
                    >
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>

        <Row className="justify-content-md-end justify-content-center align-items-center pe-2">
          {/* <Pagination /> */}

          {/* <div className="pagination">
            <div className="pagination__container">
              <ul>
                <img
                  onClick={() => handlePagination(currentPage - 1, "prev")}
                  src="/static/icons/prevbutton.png"
                  alt=""
                />

                {pageNumbers.length &&
                  pageNumbers.map((n, i) => {
                    return (
                      <li
                        onClick={() => handlePagination(n)}
                        className={n === currentPage ? "activepage" : ""}
                        key={n}
                      >
                        {n}
                      </li>
                    );
                  })}

                <li>...</li>

                <li
                  onClick={() =>
                    handlePagination(Math.ceil(customTotalSize / pageSize))
                  }
                  className={
                    currentPage === Math.ceil(customTotalSize / pageSize)
                      ? "activepage"
                      : ""
                  }
                >
                  {Math.ceil(customTotalSize / pageSize)}
                </li>

                <img
                  onClick={() => handlePagination(currentPage + 1, "next")}
                  src="/static/icons/forwardbutton.png"
                  alt=""
                />
              </ul>
            </div>
          </div> */}

          {/*  */}
          {/* <div className="pagination">
            <div className="pagination__container">
              <ul>
                <img
                  onClick={() => handlePagination(pageIndex - 1)}
                  src="/static/icons/prevbutton.png"
                  alt=""
                />

                {pageNumbers.length &&
                  pageNumbers.map((n, i) => {
                    return (
                      <li
                        onClick={() => handlePagination(i)}
                        className={i === pageIndex ? "activepage" : ""}
                        key={n}
                      >
                        {n}
                      </li>
                    );
                  })}

                <img
                  onClick={() => handlePagination(pageIndex + 1)}
                  src="/static/icons/forwardbutton.png"
                  alt=""
                />
              </ul>
            </div>
          </div> */}
        </Row>
      </div>
    </Fragment>
  );
};

TableList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
