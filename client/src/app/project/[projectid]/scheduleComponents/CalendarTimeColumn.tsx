import { FC } from "react";

interface Props {
  timeData: string[];
}

const CalendarTimeColumn: FC<Props> = ({ timeData }) => {
  return (
    <div className="w-16 h-full pr-1">
      {timeData.map((time: string, index: number) => {
        return (
          <div
            className="h-24 w-16 flex justify-center text-sm pt-1"
            key={index}
          >
            {time}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarTimeColumn;
