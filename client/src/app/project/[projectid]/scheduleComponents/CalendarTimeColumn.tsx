import { FC } from "react";

interface Props {
  timeMappingArray: string[];
}

const CalendarTimeColumn: FC<Props> = ({ timeMappingArray }) => {
  return (
    <div className="w-16 h-full pr-1">
      {timeMappingArray.map((time, index) => {
        return (
          <div className="h-24 w-16 flex justify-center" key={index}>
            {time}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarTimeColumn;
