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
      (eachSchedule.duration / configSegments) * BASE_SCHEDULE_HEIGHT;

    // TODO: identify how to display width based on the nubmer of conflicting ones
    return (
      <div
        className={`w-[calc(80%)] h-[${segmentHeight}rem] m-1 flex flex-col border`}
      >
        <div>{eachSchedule.noteName}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default EachScheduleItem;
