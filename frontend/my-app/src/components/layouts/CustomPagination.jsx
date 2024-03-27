import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const CustomPagination = ({ resPerPage, filterProducts }) => {
  const [currentPage, setCurrentPage] = useState();

  // Get the search parameters from the URL
  let [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // Get the current page from the search parameters or default to 1
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // Function to set the current page number
  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);

    // Update the "page" parameter in the search parameters
    if (searchParams.has("page")) {
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }

    // Build the new URL with updated search parameters and navigate to it
    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  return (
    <div className="d-flex justify-content-center my-5">
      {/* Render pagination component if there are more items than items per page */}
      {filterProducts > resPerPage && (
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={resPerPage}
          totalItemsCount={filterProducts}
          onChange={setCurrentPageNo}
          nextPageText={"Next"}
          prevPageText={"Prev"}
          firstPageText={"First"}
          lastPageText={"Last"}
          itemClass="page-item"
          linkClass="page-link"
        />
      )}
    </div>
  );
};

export default CustomPagination;
