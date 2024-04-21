import { useCallback, useEffect, useState } from "react";
import { EventContainer } from "../components/EventContainer";
import { ServerUrls, getServerUrl } from "../config/serverUrls";
import { ExistingEventData } from "../types/event.types";

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
    return <p>loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center gap-y-4 w-full px-4 py-12">
      {events.map((event) => (
        <EventContainer key={event.id} hasLink eventData={event} />
      ))}
    </div>
  );
};
