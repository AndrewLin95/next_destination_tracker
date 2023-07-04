import { ScheduleDateData, ScheduleCalendarData } from "@/util/models";
import { FC } from "react";

interface Props {
  projectStartEnd: ScheduleDateData | null;
  scheduleStartEnd: ScheduleCalendarData | null;
}

const ScheduleModule: FC<Props> = ({ projectStartEnd, scheduleStartEnd }) => {
  return (
    <div className="h-full w-full">
      <div>Schedule</div>
    </div>
  );
};

export default ScheduleModule;
