import Countdown from "react-countdown";
import { ExistingEventData } from "../types/event.types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Paragraph, SubHeading } from "./Typography";

interface EventInfoProps {
  eventData: ExistingEventData;
}
interface EventContainerProps {
  eventData: ExistingEventData;
  hasLink?: boolean;
}

const EventInfo = ({ eventData }: EventInfoProps) => {
  const { question, expires_at, group } = eventData;
  const expires_at_date = new Date(expires_at);

  const [isEventActive, setIsEventActive] = useState(
    Date.now() < expires_at_date.getTime()
  );

  const onComplete = () => {
    setIsEventActive(false);
  };

  return (
    <>
      <SubHeading>{question}</SubHeading>
      <Paragraph>Group: {group}</Paragraph>
      <div className="text-xl sm:text-3xl">
        {isEventActive ? (
          <Countdown
            date={expires_at_date.getTime()}
            daysInHours
            onComplete={onComplete}
          />
        ) : (
          `Finished ${expires_at_date.toLocaleString("en-GB")}`
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
          className="w-full max-w-4xl flex flex-col items-center border-2 border-transparent hover:border-indigo-600 transition-all duration-200 px-2 py-4 rounded-xl border-white"
        >
          <EventInfo eventData={eventData} />
        </Link>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center px-2 py-4">
          <EventInfo eventData={eventData} />
        </div>
      )}
    </>
  );
};
