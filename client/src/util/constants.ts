export const MAX_NUM_OF_IMAGES: number = 1;
export const NUM_RESULTS_PER_PAGE = 10;

export enum NOTE_PRIORITY {
  Low = "Low",
  Med = "Medium",
  High = "High"
}

export const SIMPLE_BUTTON_STYLE = "font-bold border-r-0 text-md p-0 bg-inherit hover:border-transparent focus:outline-none"
export const FORM_SUBMIT_BUTTON = "font-bold border-r-0 text-md p-0 bg-PrimaryButton hover:border-transparent focus:outline-none"
export const FORM_CANCEL_BUTTON = "font-bold border-r-0 text-md p-0 bg-SecondaryButton hover:border-transparent focus:outline-none"

// Styling for editNoteDialog
export enum PRIORITY_STYLE {
  Low = "pr-2 text-green-500",
  Med = "pr-2 text-yellow-500",
  High = "pr-2 text-red-500",
  Default = "pr-2",
}

export const REMOVE_IMG_BTN_STYLE = "h-10 text-sm font-bold border-r-0 text-md p-0 bg-transparent hover:border-transparent focus:outline-none"
export const UPLOAD_IMG_BTN_STYLE = "h-10 text-sm font-bold border-r-0 text-md p-0 hover:border-transparent focus:outline-none"