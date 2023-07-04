import { ScheduleInitData } from "@/util/models";
import { FC } from "react";

interface Props {
  projectStartEnd: ScheduleInitData | null;
}

const ScheduleModule: FC<Props> = ({ projectStartEnd }) => {
  return (
    <div className="h-full w-full">
      <div>Schedule</div>
    </div>
  );
};

export default ScheduleModule;
