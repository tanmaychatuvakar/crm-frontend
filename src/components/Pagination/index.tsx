import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import classNames from "classnames";

export const Pagination = ({ total, page, pageSize, setSearchParams }: any) => {
  const pages = Math.ceil(total / pageSize);

  const handlePageSize = (event: any) => {
    const { value } = event.target;
    setSearchParams({
      page: page,
      pageSize: value,
    });
  };

  const handleNextPage = () => {
    setSearchParams({
      page: page < pages ? page + 1 : page,
      pageSize: pageSize,
    });
  };

  const handlePreviousPage = () => {
    setSearchParams({
      page: page > 1 ? page - 1 : 1,
      pageSize: pageSize,
    });
  };

  const offset = page > 4 ? (pages === page ? page - 4 : page - 3) : 1;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="block ml-0 leading-tight text-gray-500 bg-white rounded-l-lg hover:text-gray-700 mr-2"
        >
          <HiChevronLeft />
        </button>

        <ul className="inline-flex items-center space-x-1">
          {[...Array(pages > 5 ? 5 : pages).keys()].map((index) => {
            let pageTo = index + offset;
            return (
              <li key={pageTo}>
                <Link
                  to={`?page=${pageTo}&pageSize=${pageSize}`}
                  className={classNames(
                    "px-2",
                    "py-1",
                    "leading-tight",
                    "border",
                    "rounded-full",
                    {
                      "bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700":
                        page !== pageTo,
                    },
                    {
                      "bg-primary-500 text-white border-primary-500":
                        page === pageTo,
                    }
                  )}
                >
                  {pageTo}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleNextPage}
          disabled={page === pages}
          className="block leading-tight text-gray-500 bg-white rounded-r-lg hover:text-gray-700 ml-2"
        >
          <HiChevronRight />
        </button>
      </div>

      <select
        value={pageSize}
        onChange={handlePageSize}
        className="rounded-md border-gray-400 text-sm"
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};
