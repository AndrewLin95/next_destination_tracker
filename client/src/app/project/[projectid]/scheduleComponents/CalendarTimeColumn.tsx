import { FC } from "react";

interface Props {
  timeValueData: Map<string, string>;
}

const CalendarTimeColumn: FC<Props> = ({ timeValueData }) => {
  return (
    <div className="w-16 h-full pr-1">
      {Object.entries(timeValueData).map(([key, value]) => {
        if (value.split(":")[1] === "30") {
          return null;
        }
        return (
          <div className="h-24 w-16 flex justify-center text-sm pt-1" key={key}>
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarTimeColumn;
