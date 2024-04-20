import { useParams } from "react-router-dom";

const EVENT_MOCK = {
  id: "1",
  question: "What is the capital of France?",
  timestamp: Date.now(),
  group: "group 1",
  accepted: ["Maciej Boruwa", "Sebastian Adidas"],
  rejected: ["Jacek Placek", "Laura Dynia"],
};

interface ResponseColumnProps {
  names: string[];
  heading: string;
}

const ResponseColumn = ({ names, heading }: ResponseColumnProps) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-y-6">
      <h3 className="text-xl sm:text-2xl">{heading}</h3>
      <div className="flex flex-col items-center gap-y-1">
        {names.map((name) => (
          <p>{name}</p>
        ))}
      </div>
    </div>
  );
};

export const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <div className="flex flex-col w-full items-center gap-y-8">
      <h1 className="text-4xl sm:text-6xl">Event page {eventId}</h1>
      <h2 className="text-2xl sm:text-4xl">{EVENT_MOCK.question}</h2>
      <p className="text-xl sm:text-2xl">{EVENT_MOCK.group}</p>
      <div className="flex w-full">
        <ResponseColumn heading="Accepted" names={EVENT_MOCK.accepted} />
        <ResponseColumn heading="Rejected" names={EVENT_MOCK.rejected} />
      </div>
    </div>
  );
};
