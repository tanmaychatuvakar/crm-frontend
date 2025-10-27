import { useState } from "react";
import { PaginationProps, PaginationState } from "./Pagination.props";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md'
import classNames from "classnames";

const initialState: PaginationState = {
  currentPage: 1,
  pageSize: 25,
};

export const Pagination: React.FC<PaginationProps> = ({
  total,
  defaultValue = initialState,
  onChange,
}) => {
  const [pagination, setPagination] = useState(defaultValue);

  const { currentPage, pageSize } = pagination;

  const pages = Math.ceil(total / pageSize) || 1;

  const handlePageSize = (pageSize: string) => {
    const pagination = { currentPage: 1,  pageSize: +pageSize };
    setPagination(pagination);
    onChange?.(pagination);
  };

  const handlePageClick = (page: number) => {
    const pagination = { currentPage: page, pageSize };
    setPagination(pagination);
    onChange?.(pagination);
  };

  const offset =
    currentPage > 4
      ? pages === currentPage
        ? currentPage - 4
        : currentPage - 3
      : 1;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex gap-x-3.5">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          <MdKeyboardArrowLeft size={20} />
        </button>

        <ul className="inline-flex items-center space-x-1">
          {[...Array(pages > 5 ? 5 : pages).keys()].map((index) => {
            let page = index + offset;
            return (
              <li key={page}>
                <button
                  onClick={() => handlePageClick(page)}
                  className={classNames(
                    "w-7 h-7",
                    "aspect-square text-xs text-white bg-black",
                    "rounded-sm",
                    {
                      "opacity-60":
                        currentPage !== page,
                    },
                    {
                      "opacity-100":
                        currentPage === page,
                    }
                  )}
                >
                  {page}
                </button>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === pages}
        >
            <MdKeyboardArrowRight size={20} />
        </button>
      </div>

      <div>
        <select
          className="border border-opacity-60 border-black rounded-sm"
          value={pageSize.toString()}
          onChange={(e)=> handlePageSize(e.target.value)}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};
