import { useCallback, useEffect, useState } from "react";
import { EventContainer } from "../components/EventContainer";
import { ExistingEventData } from "../types/event.types";
import { ServerUrls, getServerUrl } from "../config/serverUrls";
import { MainHeading, Paragraph, SubHeading } from "../components/Typography";

function HomePage() {
  const [event, setEvent] = useState<ExistingEventData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    try {
      const response = await fetch(getServerUrl(ServerUrls.GET_ACTIVE_POLL));
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      let eventData = await response.json();
      setEvent(eventData);
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
    return <Paragraph>loading...</Paragraph>;
  }

  if (error) {
    return <SubHeading className="text-red-500">{error}</SubHeading>;
  }

  if (!event) {
    return <SubHeading>Currently there is no active event</SubHeading>;
  }

  return (
    <div className="w-full flex flex-col gap-y-8 items-center">
      <MainHeading>Currently active event:</MainHeading>
      <EventContainer hasLink eventData={event} />
    </div>
  );
}

export default HomePage;
