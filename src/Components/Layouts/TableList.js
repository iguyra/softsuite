import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { useTable, useSortBy, useExpanded, usePagination } from "react-table";
import { Table, Row } from "reactstrap";
// import { Pagination } from "./Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Col, Button, Input } from "reactstrap";
import { Pagination } from "antd";
export const TableList = ({
  columns,
  data,
  pageOptions,

  customPageSize,
  customTotalSize,
  customFetchData,
  tableClass,
  theadClass,
  thClass,
  divClass,
  pagination,
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

  const [searchParams, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(5);

  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(0);

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

  // const onPaginationChange = (e) => {
  //   console.log(e, "CHAINNGG");
  // };

  const onPaginationChange = (newPageNumber) => {
    console.log(newPageNumber, "NEW__PAGE_NUMBER");
    newPageNumber = newPageNumber - 1;

    if (newPageNumber < 0) return;

    // if (limit * newPageNumber > customPageSize) return;

    setPageNumber(newPageNumber);
    console.log(newPageNumber, "NEW__PAGE_NUMBER2222");

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("offset", 4 * newPageNumber);
    // newSearchParams.set("limit", 5);

    // Replace the current URL with the updated query parameters
    // history.replace({ search: newSearchParams.toString() });
    navigate({ search: newSearchParams.toString() });
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

        {pagination && (
          <Pagination
            onChange={onPaginationChange}
            align="end"
            defaultCurrent={1}
            defaultPageSize={4}
            total={customTotalSize}
          />
        )}
      </div>
    </Fragment>
  );
};

TableList.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};
