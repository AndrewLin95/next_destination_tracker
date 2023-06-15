import { useContext } from "react";
import ProjectContext from "../context/ProjectContext";

const SearchModule = () => {
  const { projectState, setProjectState } = useContext(ProjectContext);

  return (
    <div className="flex flex-col w-1/5 h-full border border-gray-600">
      search moudle
      {projectState}
      <button onClick={() => setProjectState("2")}>Click</button>
    </div>
  );
};

export default SearchModule;
