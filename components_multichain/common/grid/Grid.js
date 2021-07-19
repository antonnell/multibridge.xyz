/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import classNames from 'classnames';
import Select from 'react-select';

import config from '../../../config';
import 'ag-grid-community/dist/styles/ag-grid.css';
import styles from './grid.module.scss';
import useBreakpoints from '../../../framework/useBreakpoints';
/**
 * Extension of ag-grid, for app purpose
 */
function Grid({
  className,
  rowData,
  frameworkComponents,
  columnDefs,
  defaultColDef,
  agGridProps,
}) {
  const [gridApi, setGridApi] = useState(null);
  const { rowsPerPage, defaultRowsPerPage } = config.grid;
  const rowsPerPageOptions = rowsPerPage.map((rows) => ({
    value: rows,
  }));

  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: defaultRowsPerPage,
    total: rowData.length,
    totalPages: Math.ceil(rowData.length / defaultRowsPerPage),
  });
  const { isMobile } = useBreakpoints();
  const computePaginationState = () => {
    const start = pagination.currentPage * pagination.pageSize + 1;
    let end =
      pagination.currentPage * pagination.pageSize + pagination.pageSize;
    end = end > pagination.total ? pagination.total : end;

    // Disable Prev/Next when in first/last page
    const nextDisabled = pagination.currentPage + 1 === pagination.totalPages;
    const prevDisabled = pagination.currentPage === 0;

    const nextStyle = classNames(styles.next, {
      [styles.disabled]: nextDisabled,
    });
    const prevStyle = classNames(styles.prev, {
      [styles.disabled]: prevDisabled,
    });
    return {
      start,
      end,
      nextStyle,
      prevStyle,
    };
  };

  const columnDefsWithFiller = [
    {
      headerName: '',
      field: '_filler',
      width: 30,
    },
    ...columnDefs,
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // No alternate row coloring
  const getRowStyle = () => ({ background: 'none' });

  // Pagination Events
  const onPageSizeChanged = (pageSize) => {
    gridApi.paginationSetPageSize(pageSize);
  };
  const onNext = () => {
    if (pagination.currentPage + 1 === pagination.totalPages) return;
    gridApi.paginationGoToNextPage();
  };
  const onPrev = () => {
    if (pagination.currentPage === 0) return;
    gridApi.paginationGoToPreviousPage();
  };
  // Any change: Prev, Next, RowsPerPage change, triggers below. Use this to set the visbility of elements
  const onPaginationChanged = () => {
    if (!gridApi) return;
    setPagination({
      ...pagination,
      totalPages: gridApi.paginationGetTotalPages(),
      currentPage: gridApi.paginationGetCurrentPage(),
      pageSize: gridApi.paginationGetPageSize(),
    });
  };

  const { start, end, nextStyle, prevStyle } = computePaginationState();

  const selectedIndex = rowsPerPageOptions.findIndex(
    (o) => o.value === pagination.pageSize
  );
  const customComponents = {
    IndicatorSeparator: () => null,
    DropdownIndicator: () => (
      <img
        src="/images/downChevron.svg"
        className={styles.downIcon}
        alt="Select"
      />
    ),
  };
  // Attach parent sent className, mobile classes
  const styleNames = `${styles.grid} ${className} ${
    isMobile ? styles.isMobile : ''
  }`;

  rowsPerPageOptions.forEach((o) => {
    o.label = `Show ${o.value}`;
  });
  return (
    <div className={styleNames}>
      <AgGridReact
        getRowStyle={getRowStyle}
        defaultColDef={defaultColDef}
        rowClass={styles.gridRow}
        rowHeight={70} // associated style: .gridRow padding. Any adjustments to height, revisit padding
        headerHeight={isMobile ? 50 : 67}
        columnDefs={columnDefsWithFiller}
        frameworkComponents={frameworkComponents}
        onGridReady={onGridReady}
        rowData={rowData}
        pagination
        paginationPageSize={pagination.pageSize}
        onPaginationChanged={onPaginationChanged}
        suppressPaginationPanel
        suppressCellSelection
        {...agGridProps}
      />
      <div className={styles.paginationPanel}>
        <div className={styles.rowsPerPage}>
          <Select
            className={styles.selector}
            options={rowsPerPageOptions}
            menuPlacement="auto"
            onChange={(option) => onPageSizeChanged(option.value)}
            components={customComponents} // remove indicator separator
            value={
              selectedIndex >= 0 ? rowsPerPageOptions[selectedIndex] : null
            }
            classNamePrefix="selector"
            isSearchable={false}
          />
        </div>

        <div className={styles.pagination}>
          <div
            role="button"
            className={prevStyle}
            onClick={onPrev}
            onKeyDown={onPrev}
            tabIndex="0"
          >
            Prev
          </div>
          <div className={styles.startEndTotalDisplay}>
            {start} - {end} of {pagination.total}
          </div>
          <div
            role="button"
            className={nextStyle}
            onClick={onNext}
            onKeyDown={onNext}
            tabIndex="0"
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}
Grid.propTypes = {
  className: PropTypes.string,
  rowData: PropTypes.arrayOf(PropTypes.object),
  frameworkComponents: PropTypes.object,
  columnDefs: PropTypes.arrayOf(PropTypes.object),
  defaultColDef: PropTypes.object,
  agGridProps: PropTypes.object,
};
Grid.defaultProps = {
  className: '',
  rowData: [],
  frameworkComponents: {},
  columnDefs: [],
  defaultColDef: {},
  agGridProps: {},
};
export default Grid;
