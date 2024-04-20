import Countdown from "react-countdown";
import { ExistingEventData } from "../types/event.types";
import { useState } from "react";
import { Link } from "react-router-dom";

interface EventInfoProps {
  eventData: ExistingEventData;
}
interface EventContainerProps {
  eventData: ExistingEventData;
  hasLink?: boolean;
}

const EventInfo = ({ eventData }: EventInfoProps) => {
  const { question, timestamp, group } = eventData;
  const [isEventActive, setIsEventActive] = useState(Date.now() < timestamp);
  const onComplete = () => {
    setIsEventActive(false);
  };
  return (
    <>
      <h3 className="text-2xl sm:text-3xl">{question}</h3>
      <p className="text-xl sm:text-2xl">{group}</p>
      <div className="text-2xl sm:text-3xl">
        {isEventActive ? (
          <Countdown date={timestamp} daysInHours onComplete={onComplete} />
        ) : (
          `Finished ${new Date(timestamp).toLocaleString("en-GB")}`
        )}
      </div>
    </>
  );
};

export const EventContainer = ({ eventData, hasLink }: EventContainerProps) => {
  const { id } = eventData;
  return (
    <>
      {hasLink ? (
        <Link
          to={`/event/${id}`}
          className="w-full flex flex-col items-center hover:bg-gray-800 transition-all duration-200 px-2 py-4 rounded-xl border bg-gray-900 "
        >
          <EventInfo eventData={eventData} />
        </Link>
      ) : (
        <div className="w-full flex flex-col items-center px-2 py-4">
          <EventInfo eventData={eventData} />
        </div>
      )}
    </>
  );
};
