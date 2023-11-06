import React, { FC, useState, useRef, useEffect } from "react";
import { DroppedParsedData, EachScheduleData, ScheduleColors } from "@/util/models/ProjectModels";
import {
  BASE_SCHEDULE_HEIGHT,
  DAYS_OF_WEEK,
  HEX_TRANSPARENCY,
  SIMPLE_BUTTON_STYLE,
} from "@/util/constants";
import SelectivelyRenderPriorityIcons from "../components/SelectivelyRenderPriorityIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { formatInTimeZone } from "date-fns-tz";

interface Props {
  eachSchedule: EachScheduleData;
  configSegments: number;
  scheduleColors: ScheduleColors;
  time:string,
  date: string,
  dateUnix: number;
  handleDeleteSchedule: (locationID: string) => void;
  stackedSegment: boolean;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, note: EachScheduleData) => void;
  editScheduleDuration: (
    time: string,
    date: string,
    dateUnix: number,
    data: DroppedParsedData,
  ) => void;
}

const EachScheduleItem: FC<Props> = ({
  eachSchedule,
  configSegments,
  scheduleColors,
  time,
  date,
  dateUnix,
  handleDeleteSchedule,
  stackedSegment,
  handleDrag,
  editScheduleDuration
}) => {
  if (eachSchedule.dataSegment && eachSchedule.duration !== undefined) {
    const segmentHeight =
      (eachSchedule.duration / configSegments) * BASE_SCHEDULE_HEIGHT - 0.75;
    const segmentWidth = 95 / (eachSchedule.numColumns as number);
    const dayOfWeek: DAYS_OF_WEEK = formatInTimeZone(
      dateUnix,
      "GMT",
      "iiii"
    ) as DAYS_OF_WEEK;

    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [currentResizer, setCurrentResizer] = useState<EventTarget | null>(null);
    const [resizeBox, setResizeBox] = useState<any>();
    const elRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      const handleResizerMouseMove = (e: MouseEvent) => {
        if (isResizing && elRef.current && currentResizer instanceof Element) {
          let movementY = e.clientY - dragStart;

          let newHeight = resizeBox.height + movementY;
          
          //47px = 1 segment
          let roundedHeight = (Math.floor(newHeight / 47) * BASE_SCHEDULE_HEIGHT) - 0.75;

          if (roundedHeight < 3) {
            roundedHeight = 2.6;
          }

          if (currentResizer.classList.contains('bot')) {
            elRef.current.style.height = `${roundedHeight}rem`;
          } 
  
        }
      };
  
      const handleResizerMouseUp = () => {
        if (elRef.current) {
          const newDuration = Math.floor(parseFloat(elRef.current.style.height.replace('rem', ''))/2.6)*30;
          eachSchedule.duration = newDuration;
          const dropData = {
            noteName: eachSchedule.noteName,
            noteMessage: eachSchedule.noteMessage,
            notePriority: eachSchedule.notePriority,
            locationID: eachSchedule.locationID,
            isScheduleEdit: true,
            duration: eachSchedule.duration,
          };
          editScheduleDuration(time, date, dateUnix, JSON.parse(JSON.stringify(dropData)));
        }
        
        window.removeEventListener('mousemove', handleResizerMouseMove);
        window.removeEventListener('mouseup', handleResizerMouseUp);
        setIsResizing(false);
        setCurrentResizer(null);
      };
  
      if (isResizing) {
        window.addEventListener('mousemove', handleResizerMouseMove);
        window.addEventListener('mouseup', handleResizerMouseUp);
      }
  
      return () => {
        window.removeEventListener('mousemove', handleResizerMouseMove);
        window.removeEventListener('mouseup', handleResizerMouseUp);
      };
    }, [isResizing, currentResizer, dragStart]);
  
    const handleResizerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      setCurrentResizer(e.currentTarget);
      setDragStart(e.clientY);
      setIsResizing(true);
      if (elRef.current) {
        setResizeBox(elRef.current.getBoundingClientRect())
      }
    };

    return (
      <div
        className={`flex flex-col border border-dark_primary5 dark:border-primary5 justify-between`}
        style={{
          width: `${segmentWidth}%`,
          height: `${segmentHeight}rem`,
          position: stackedSegment
            ? "static"
            : eachSchedule.position === 0
            ? "static"
            : "relative",
          left: eachSchedule.position === 0 ? "" : "50%",
          backgroundImage: `linear-gradient(${scheduleColors[dayOfWeek]}${HEX_TRANSPARENCY.SeventyPercent}, transparent)`,
          textShadow: "1px 1px 2px black",
        }}
        draggable={!isResizing}
        onDragStart={(e) => {handleDrag(e, eachSchedule)}}
        ref = {elRef}
      >
        <div>
          <div className="flex flex-row relative">
            <div className="capitalize pb-1 text-sm mr-4 truncate">
              {eachSchedule.noteName}
            </div>
            <button className={`${SIMPLE_BUTTON_STYLE} absolute right-1 top-0`}>
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{ color: "#b070b2" }}
                onClick={() => handleDeleteSchedule(eachSchedule.locationID)}
              />
            </button>
          </div>
          <div className="text-xs truncate">
            {eachSchedule.timeFrom} - {eachSchedule.timeTo}
          </div>
        </div>
        <div>
          {segmentHeight > 2.25 ? (
            <div className="flex justify-end pr-1 pb-1">
              <SelectivelyRenderPriorityIcons
                priority={eachSchedule.notePriority}
              />
            </div>) 
            : null 
          }
          <div className={`resizer bot`} onMouseDown={handleResizerMouseDown}></div>
        </div>
        
      </div>
    );
  } else {
    return null;
  }
};

export default EachScheduleItem;
