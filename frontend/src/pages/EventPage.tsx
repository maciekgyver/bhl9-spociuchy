import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ExistingEventData } from "../types/event.types";
import { ServerUrls, getServerUrl } from "../config/serverUrls";
import { EventContainer } from "../components/EventContainer";
import { SubHeading } from "../components/Typography";

interface ResponseColumnProps {
  names?: string[];
  heading?: string;
}

const ResponseColumn = ({ names, heading }: ResponseColumnProps) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-y-6">
      <h3 className="text-xl sm:text-2xl">{heading}</h3>
      <div className="flex flex-col items-center gap-y-1">
        {names?.map((name) => (
          <p>{name}</p>
        ))}
      </div>
    </div>
  );
};

export const EventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<ExistingEventData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    try {
      const response = await fetch(
        getServerUrl(ServerUrls.GET_ACTIVITY, eventId)
      );
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      let postsData = await response.json();
      setEvent(postsData.id ? postsData : undefined);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setEvent(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, []);

  if (loading) {
    return <SubHeading>loading...</SubHeading>;
  }

  if (error) {
    return <SubHeading className="text-red-500">{error}</SubHeading>;
  }

  if (!event) {
    return <SubHeading>Event not found</SubHeading>;
  }

  return (
    <div className="flex flex-col w-full items-center gap-y-8">
      <EventContainer eventData={event} />
      <div className="flex w-full">
        <ResponseColumn heading="People who accepted" names={event.voted_yes} />
      </div>
    </div>
  );
};
