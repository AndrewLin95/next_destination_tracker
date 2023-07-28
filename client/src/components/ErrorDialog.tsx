import { StatusPayload } from "@/util/models/ProjectModels";
import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";

interface Props {
  setErrorDialogToggle: Dispatch<SetStateAction<Boolean>>;
  errorDialogData: StatusPayload;
}

const ErrorDialog: FC<Props> = ({ setErrorDialogToggle, errorDialogData }) => {
  return (
    <>
      <div
        className="absolute h-screen w-screen bg-slate-900/40"
        onClick={() => setErrorDialogToggle(false)}
      />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[28rem] h-60 bg-Background flex flex-col p-4 border border-solid border-black z-50">
        <div className="font-bold pb-2 text-lg">
          {errorDialogData.errorCause}
        </div>
        <div className="flex justify-center items-center">
          <Image
            className="h-20 w-20"
            src="/ErrorIcon.png"
            alt="Error Image"
            height={144}
            width={144}
          />
        </div>
        <div className="text-sm italic pt-2 pb-2">
          {errorDialogData.errorData}
        </div>
        <div className="flex justify-end">
          <button
            className="bg-Accent"
            type="button"
            onClick={() => setErrorDialogToggle(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ErrorDialog;
