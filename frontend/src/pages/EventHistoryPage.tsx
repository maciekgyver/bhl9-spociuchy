import { EventContainer } from "../components/EventContainer";
import { ExistingEventData } from "../types/event.types";

const MOCKED_EVENTS: ExistingEventData[] = [
  {
    question: "test question",
    timestamp: Date.now() + 1000,
    group: "group_1",
  },
  {
    question: "test question 2",
    timestamp: Date.now() - 100000,
    group: "group_1",
  },
  {
    question: "test question 3",
    timestamp: Date.now() - 200000,
    group: "group_1",
  },
];

export const EventHistoryPage = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      {MOCKED_EVENTS.map((event) => (
        <EventContainer eventData={event} />
      ))}
    </div>
  );
};
