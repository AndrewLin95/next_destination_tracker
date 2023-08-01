import { FC, useState } from "react";
import { DAYS_OF_WEEK, SIMPLE_BUTTON_STYLE } from "@/util/constants";
import { CompactPicker } from "react-color";

interface Props {
  dayOfWeek: DAYS_OF_WEEK;
  color: string;
}

const DateColorPicker: FC<Props> = ({ dayOfWeek, color }) => {
  const [togglePicker, setTogglePicker] = useState(false);
  const [newColor, setNewColor] = useState(color);

  const handleChange = (e: any) => {
    setNewColor(e.hex);
  };

  return (
    <div className="flex flex-col justify-center pr-1">
      <div className="flex flex-row">
        <button
          type="button"
          className={`${SIMPLE_BUTTON_STYLE} h-8 w-8`}
          style={{ backgroundColor: newColor }}
          onClick={() => setTogglePicker(true)}
        />
        <label className="w-24 pl-2" style={{ color: newColor }}>
          {dayOfWeek}
        </label>
        <input value={newColor} type="hidden" name={`${dayOfWeek}Color`} />
      </div>
      {togglePicker ? (
        <>
          <div
            className="absolute h-full w-full top-1 left-1"
            onClick={() => setTogglePicker(false)}
          />
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div style={{ color: newColor }} className="bg-slate-400/90">
              {dayOfWeek}
            </div>
            <CompactPicker
              color={newColor}
              onChangeComplete={(e) => handleChange(e)}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DateColorPicker;
