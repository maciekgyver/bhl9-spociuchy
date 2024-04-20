import { EventContainer } from "../components/EventContainer";
import { ExistingEventData } from "../types/event.types";

const MOCKED_EVENT: ExistingEventData = {
  id: "1",
  question: "test question",
  timestamp: Date.now() + 100000,
  group: "group_1",
};

function HomePage() {
  return (
    <div className="w-full">
      <EventContainer hasLink eventData={MOCKED_EVENT} />
    </div>
  );
}

export default HomePage;
