import { useCallback, useEffect, useState } from "react";
import { EventContainer } from "../components/EventContainer";
import { ServerUrls, getServerUrl } from "../config/serverUrls";
import { ExistingEventData } from "../types/event.types";
import { Spinner } from "../components/icons/Spinner";
import { MainHeading, Paragraph } from "../components/Typography";

export const EventHistoryPage = () => {
  const [events, setEvents] = useState<ExistingEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllActivities = useCallback(async () => {
    try {
      const response = await fetch(getServerUrl(ServerUrls.GET_ACTIVITIES));
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      let postsData = await response.json();
      setEvents(postsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActivities();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Paragraph className="text-red-500">{error}</Paragraph>;
  }

  if (!events || !events[0].id) {
    return <Paragraph className="text-red-500">Something went wrong</Paragraph>;
  }

  return (
    <div className="flex flex-col gap-y-6 sm:gap-y-8 w-full items-center py-8 sm:py-12">
      <MainHeading>Event history</MainHeading>
      <div className="flex flex-col items-center gap-y-4 w-full">
        {events.map((event) => (
          <EventContainer key={event.id} hasLink eventData={event} />
        ))}
      </div>
    </div>
  );
};
