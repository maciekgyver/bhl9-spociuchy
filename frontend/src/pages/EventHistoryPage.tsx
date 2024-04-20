import { EventContainer } from "../components/EventContainer";
import { MOCKED_EVENTS } from "../mocks/eventsMock";

export const EventHistoryPage = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      {MOCKED_EVENTS.map((event) => (
        <EventContainer hasLink eventData={event} />
      ))}
    </div>
  );
};
