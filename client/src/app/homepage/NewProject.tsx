import Image from "next/image";

const NewProject = () => {
  return (
    <div className="flex h-1/2 w-full border border-red-500 justify-center items-center">
      <div className="flex flex-col border border-dashed w-4/12 h-4/5 p-8">
        <form>
          <div className="flex flex-col h-full">
            <input
              className="w-full mb-2"
              placeholder="Target Destination"
              name="destination"
            />
            <input
              className="w-full mb-2"
              placeholder="Project Description"
              name="description"
            />
            <div className="flex flex-row mb-2">
              <div className="w-64">Planned Start Date:</div>
              <input className="w-full" type="date" name="startDate" />
            </div>
            <div className="flex flex-row mb-2">
              <div className="w-64">Planned End Date:</div>
              <input className="w-full" type="date" name="endDate" />
            </div>
            <Image
              alt="vacation image"
              src="/seasideVacation.jpg"
              className="h-auto w-full max-h-40 object-cover"
              width={288}
              height={288}
            />
            <button type="submit">Track new project!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
