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

const SelectivelyRenderPriorityIcons: FC<Props> = ({ priority }) => {
  if (priority === NOTE_PRIORITY.Low) {
    return (
      <FontAwesomeIcon
        icon={faPerson}
        size="lg"
        className={PRIORITY_STYLE.Low}
      />
    );
  } else if (priority === NOTE_PRIORITY.Med) {
    return (
      <FontAwesomeIcon
        icon={faPersonWalking}
        size="lg"
        className={PRIORITY_STYLE.Med}
      />
    );
  } else {
    return (
      <FontAwesomeIcon
        icon={faPersonRunning}
        size="lg"
        className={PRIORITY_STYLE.High}
      />
    );
  }
};

export default SelectivelyRenderPriorityIcons;
