import { FC } from "react";
import { EachScheduleData, ScheduleColors } from "@/util/models";
import {
  BASE_SCHEDULE_HEIGHT,
  DAYS_OF_WEEK,
  HEX_TRANSPARENCY,
  SIMPLE_BUTTON_STYLE,
} from "@/util/constants";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  eachSchedule: EachScheduleData;
  configSegments: number;
  scheduleColors: ScheduleColors;
  dateUnix: number;
  handleDeleteSchedule: (locationID: string) => void;
}

const EachScheduleItem: FC<Props> = ({
  eachSchedule,
  configSegments,
  scheduleColors,
  dateUnix,
  handleDeleteSchedule,
}) => {
  if (eachSchedule.dataSegment && eachSchedule.duration !== undefined) {
    const segmentHeight =
      (eachSchedule.duration / configSegments) * BASE_SCHEDULE_HEIGHT - 0.75;
    const segmentWidth = 90 / (eachSchedule.numColumns as number);
    const dayOfWeek: DAYS_OF_WEEK = formatInTimeZone(
      dateUnix,
      "GMT",
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
          <div className="flex flex-row relative">
            <div className="capitalize pb-1 text-sm mr-4">
              {eachSchedule.noteName}
            </div>
            <button className={`${SIMPLE_BUTTON_STYLE} absolute right-1 top-0`}>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ color: "#b070b2" }}
                onClick={() => handleDeleteSchedule(eachSchedule.locationID)}
              />
            </button>
          </div>
          <div className="text-xs">
            {eachSchedule.timeFrom} - {eachSchedule.timeTo}
          </div>
        </div>
        <div className="flex justify-end pr-1 pb-1">
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
