import { FC } from "react";

interface Props {
  paginationState: (string | number)[];
  handlePageChange: (value: string | number) => void;
}

const SearchPagination: FC<Props> = ({ paginationState, handlePageChange }) => {
  if (paginationState.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row justify-center pb-4">
      <button
        className="w-12 h-12 border bg-Background_Lighter"
        onClick={() => handlePageChange("-")}
      >
        {"<"}
      </button>
      {paginationState.map((paginationValue, index) => {
        return (
          <button
            key={index}
            className="w-12 h-12 border bg-Background_Lighter"
            onClick={() => handlePageChange(paginationValue)}
          >
            {paginationValue}
          </button>
        );
      })}
      <button
        className="w-12 h-12 border bg-Background_Lighter"
        onClick={() => handlePageChange("+")}
      >
        {">"}
      </button>
    </div>
  );
};

export default SearchPagination;
