import { FC } from "react";

interface Props {
  buttonText: string;
}

const InLineTextButton: FC<Props> = ({ buttonText }) => {
  return (
    <div>
      <button className="font-bold text-dark_accent1 dark:text-accent1 border-r-0 text-md p-0 bg-inherit hover:border-transparent focus:outline-none">
        {buttonText}
      </button>
    </div>
  );
};

export default InLineTextButton;
