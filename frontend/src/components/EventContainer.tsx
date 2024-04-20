import Countdown from "react-countdown";
import { ExistingEventData } from "../types/event.types";
import { useState } from "react";

interface EventContainerProps {
  eventData: ExistingEventData;
}

export const EventContainer = ({ eventData }: EventContainerProps) => {
  const { question, timestamp, group } = eventData;
  const [isEventActive, setIsEventActive] = useState(Date.now() < timestamp);
  const onComplete = () => {
    setIsEventActive(false);
  };
  return (
    <button className="w-full flex flex-col items-center hover:bg-slate-600 transition-all duration-200 px-2 py-4 rounded-xl">
      <h3 className="text-3xl">{question}</h3>
      <p className="text-2xl">{group}</p>
      <div className="text-4xl">
        {isEventActive ? (
          <Countdown date={timestamp} daysInHours onComplete={onComplete} />
        ) : (
          `Finished ${new Date(timestamp).toLocaleString("en-GB")}`
        )}
      </div>
    </button>
  );
};
