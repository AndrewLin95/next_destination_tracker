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
  PRIORITY_HIGH_STYLE,
  PRIORITY_LOW_STYLE,
  PRIORITY_MED_STYLE,
} from "@/util/constants";

interface Props {
  priority: string;
}

const SelectivelyRenderPriorityIcons: FC<Props> = ({ priority }) => {
  if (priority === NOTE_PRIORITY_LOW) {
    return (
      <FontAwesomeIcon
        icon={faPerson}
        size="lg"
        className={PRIORITY_LOW_STYLE}
      />
    );
  } else if (priority === NOTE_PRIORITY_MED) {
    return (
      <FontAwesomeIcon
        icon={faPersonWalking}
        size="lg"
        className={PRIORITY_MED_STYLE}
      />
    );
  } else {
    return (
      <FontAwesomeIcon
        icon={faPersonRunning}
        size="lg"
        className={PRIORITY_HIGH_STYLE}
      />
    );
  }
};

export default SelectivelyRenderPriorityIcons;
