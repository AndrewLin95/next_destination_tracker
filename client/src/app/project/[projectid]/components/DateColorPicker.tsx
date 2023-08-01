import { FC, useState } from "react";
import { DAYS_OF_WEEK, SIMPLE_BUTTON_STYLE } from "@/util/constants";
import { ChromePicker, ChromePickerProps } from "react-color";

interface Props {
  dayOfWeek: DAYS_OF_WEEK;
  color: string;
}

const DateColorPicker: FC<Props> = ({ dayOfWeek, color }) => {
  const [togglePicker, setTogglePicker] = useState(false);
  const [newcolor, setNewColor] = useState(undefined);

  const handleChange = (e: any) => {
    console.log(e);
  };

  return (
    <div className="flex flex-row items-center">
      <div className="pr-2">{dayOfWeek}</div>
      <button
        type="button"
        className={`${SIMPLE_BUTTON_STYLE} h-8 w-8`}
        style={{ backgroundColor: color }}
        onClick={() => setTogglePicker(true)}
      ></button>
      {togglePicker ? (
        <ChromePicker color={color} onChangeComplete={(e) => handleChange(e)} />
      ) : null}
    </div>
  );
};

export default DateColorPicker;
