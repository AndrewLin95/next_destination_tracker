import { NoteData } from "@/util/models";
import { FC } from "react";
import Note from "./Note";

interface Props {
  noteData: NoteData[];
  handleEditNoteDialog: (note: NoteData) => void;
}

const SearchResults: FC<Props> = ({ noteData, handleEditNoteDialog }) => {
  if (noteData.length === 0) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="flex flex-row justify-center items-center p-4 text-2xl">
        <div className="pr-4 text-lg">Searched Places</div>
      </div>
      <div className="flex flex-col items-center h-[calc(100vh-17rem)] overflow-y-auto">
        {noteData.map((note) => {
          return (
            <Note
              key={note.locationID}
              note={note}
              handleEditNoteDialog={handleEditNoteDialog}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
