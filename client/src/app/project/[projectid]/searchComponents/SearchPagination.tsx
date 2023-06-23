import { FC } from "react";

const SearchPagination: FC = () => {
  return (
    <div className="flex flex-row justify-center pb-4">
      <button className="w-12 h-12 border">{"<"}</button>
      <button className="w-12 h-12 border"></button>
      <button className="w-12 h-12 border">{">"}</button>
    </div>
  );
};

export default SearchPagination;
