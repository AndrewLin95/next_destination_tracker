import { FC } from "react";
import { ProjectData } from "@/util/models/ProjectModels";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  existingProjectsList: ProjectData[];
  handleEachProjectClick: (projectID: string) => void;
}

const options = { delay: 2000 };

const ExistingProjects: FC<Props> = ({
  existingProjectsList,
  handleEachProjectClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true },
    [Autoplay(options)]
  );

  // TODO: clause to render if there are no existing projects
  return (
    <div className="flex h-1/2 w-full justify-center items-center">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex select-none cursor-grab active:cusor-grabbing">
          {existingProjectsList.map((existingProject) => {
            const startDate = formatInTimeZone(
              existingProject.project.projectStartDate,
              "GMT",
              "PP"
            );
            const endDate = formatInTimeZone(
              existingProject.project.projectEndDate,
              "GMT",
              "PP"
            );
            return (
              <div
                className="h-60 w-72 flex flex-col p-2 border mr-8 border-dark_accent2 bg-primary2 dark:border-accent2 dark:bg-dark_primary2"
                key={existingProject.projectID}
                onClick={() =>
                  handleEachProjectClick(existingProject.projectID)
                }
              >
                <Image
                  alt={`${existingProject.project.projectName} image`}
                  src={existingProject.project.projectImage}
                  className="w-full h-28 object-cover"
                  width={144}
                  height={144}
                />
                <div className="font-bold">
                  {existingProject.project.projectName}
                </div>
                <div className="h-20 pt-2 overflow-auto">
                  {existingProject.project.projectDescription}
                </div>
                <div className="flex justify-end">
                  {startDate} - {endDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExistingProjects;
