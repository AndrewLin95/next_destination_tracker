import { FC } from "react";
import { EachScheduleData, ScheduleColors } from "@/util/models";
import {
  BASE_SCHEDULE_HEIGHT,
  DAYS_OF_WEEK,
  HEX_TRANSPARENCY,
} from "@/util/constants";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";
import { format } from "date-fns";

interface Props {
  eachSchedule: EachScheduleData;
  configSegments: number;
  scheduleColors: ScheduleColors;
  dateUnix: number;
}

const EachScheduleItem: FC<Props> = ({
  eachSchedule,
  configSegments,
  scheduleColors,
  dateUnix,
}) => {
  if (eachSchedule.dataSegment && eachSchedule.duration !== undefined) {
    const segmentHeight =
      (eachSchedule.duration / configSegments) * BASE_SCHEDULE_HEIGHT - 0.75;
    const segmentWidth = 90 / (eachSchedule.numColumns as number);
    const dayOfWeek: DAYS_OF_WEEK = format(
      new Date(dateUnix),
      "iiii"
    ) as DAYS_OF_WEEK;

    return (
      <div
        className={`flex flex-col border justify-between`}
        style={{
          width: `${segmentWidth}%`,
          height: `${segmentHeight}rem`,
          position: eachSchedule.position === 0 ? "static" : "relative",
          left: eachSchedule.position === 0 ? "" : "47%",
          backgroundImage: `linear-gradient(${scheduleColors[dayOfWeek]}${HEX_TRANSPARENCY.SeventyPercent}, transparent)`,
          textShadow: "1px 1px 2px black",
        }}
      >
        <div>
          <div className="capitalize pb-1">{eachSchedule.noteName}</div>
          <div className="text-xs">
            {eachSchedule.timeFrom} - {eachSchedule.timeTo}
          </div>
        </div>
        <div className="flex justify-end pr-1">
          <SelectivelyRenderPriorityIcons
            priority={eachSchedule.notePriority}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default EachScheduleItem;
