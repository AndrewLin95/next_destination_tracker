import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faPersonWalking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import { NOTE_PRIORITY, PRIORITY_STYLE } from "@/util/constants";

interface Props {
  priority: string;
}

const RenderAllPriorityIcons: FC<Props> = ({ priority }) => {
  return (
    <div>
      <FontAwesomeIcon
        icon={faPerson}
        size="lg"
        className={
          priority === NOTE_PRIORITY.Low
            ? PRIORITY_STYLE.Low
            : PRIORITY_STYLE.Default
        }
      />
      <FontAwesomeIcon
        icon={faPersonWalking}
        size="lg"
        className={
          priority === NOTE_PRIORITY.Med
            ? PRIORITY_STYLE.Med
            : PRIORITY_STYLE.Default
        }
      />
      <FontAwesomeIcon
        icon={faPersonRunning}
        size="lg"
        className={
          priority === NOTE_PRIORITY.High
            ? PRIORITY_STYLE.High
            : PRIORITY_STYLE.Default
        }
      />
    </div>
  );
};

export default RenderAllPriorityIcons;
