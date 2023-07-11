import { FC } from "react";
import { EachScheduleData } from "@/util/models";
import { BASE_SCHEDULE_HEIGHT } from "@/util/constants";

interface Props {
  eachSchedule: EachScheduleData;
  configSegments: number;
  index: number;
}

const EachScheduleItem: FC<Props> = ({
  eachSchedule,
  configSegments,
  index,
}) => {
  if (eachSchedule.dataSegment && eachSchedule.duration !== undefined) {
    const segmentHeight =
      (eachSchedule.duration / configSegments) * BASE_SCHEDULE_HEIGHT - 0.75;
    const segmentWidth = 90 / (eachSchedule.numColumns as number);

    return (
      <div
        className="flex flex-col border"
        style={{
          width: `${segmentWidth}%`,
          height: `${segmentHeight}rem`,
          position: eachSchedule.position === 0 ? "static" : "relative",
          left: eachSchedule.position === 0 ? "" : "47%",
        }}
      >
        <div>{eachSchedule.noteName}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default EachScheduleItem;
