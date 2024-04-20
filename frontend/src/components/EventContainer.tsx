import Countdown from "react-countdown";
import { ExistingEventData } from "../types/event.types";

interface EventContainerProps {
  eventData: ExistingEventData;
}

export const EventContainer = ({ eventData }: EventContainerProps) => {
  const { question, timestamp, group } = eventData;
  const onComplete = () => {
    console.log("chuj");
  };
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-3xl">{question}</h3>
      <p className="text-2xl">{group}</p>
      <Countdown
        className="text-6xl"
        date={timestamp}
        onComplete={onComplete}
      />
    </div>
  );
};
