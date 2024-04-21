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
  const { question, created_at, expires_at, group } = eventData;
  const [isEventActive, setIsEventActive] = useState(Date.now() < expires_at);
  const onComplete = () => {
    setIsEventActive(false);
  };
  return (
    <>
      <h3 className="text-2xl sm:text-3xl">{question}</h3>
      <p className="text-xl sm:text-2xl">{group}</p>
      <div className="text-2xl sm:text-3xl">
        {isEventActive ? (
          <Countdown date={expires_at} daysInHours onComplete={onComplete} />
        ) : (
          `Finished ${new Date(expires_at).toLocaleString("en-GB")}`
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
          className="w-full flex flex-col items-center border-2 border-transparent hover:border-indigo-600 transition-all duration-200 px-2 py-4 rounded-xl border-white"
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
