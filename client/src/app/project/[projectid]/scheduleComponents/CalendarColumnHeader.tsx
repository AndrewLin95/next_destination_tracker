import { FC } from "react";

interface Props {
  calendarDate: string;
  dayOfWeek: string;
  enabled: boolean;
}

const CalendarColumnHeader: FC<Props> = ({
  calendarDate,
  dayOfWeek,
  enabled,
}) => {
  return (
    <div className="w-[calc((100vw-25rem)/7)] pr-1 justify-center items-center flex flex-col">
      <div className="text-sm font-bold">{dayOfWeek}</div>
      <div className="text-sm">{calendarDate}</div>
    </div>
  );
};

export default CalendarColumnHeader;
