import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faPersonWalking,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import {
  NOTE_PRIORITY_LOW,
  NOTE_PRIORITY_MED,
  NOTE_PRIORITY_HIGH,
  PRIORITY_DEFAULT_STYLE,
  PRIORITY_LOW_STYLE,
  PRIORITY_MED_STYLE,
  PRIORITY_HIGH_STYLE,
} from "@/util/constants";

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
          priority === NOTE_PRIORITY_LOW
            ? PRIORITY_LOW_STYLE
            : PRIORITY_DEFAULT_STYLE
        }
      />
      <FontAwesomeIcon
        icon={faPersonWalking}
        size="lg"
        className={
          priority === NOTE_PRIORITY_MED
            ? PRIORITY_MED_STYLE
            : PRIORITY_DEFAULT_STYLE
        }
      />
      <FontAwesomeIcon
        icon={faPersonRunning}
        size="lg"
        className={
          priority === NOTE_PRIORITY_HIGH
            ? PRIORITY_HIGH_STYLE
            : PRIORITY_DEFAULT_STYLE
        }
      />
    </div>
  );
};

export default RenderAllPriorityIcons;
