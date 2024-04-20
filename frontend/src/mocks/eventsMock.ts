import { ExistingEventData } from "../types/event.types";

export const MOCKED_EVENTS: ExistingEventData[] = [
  {
    id: "1",
    question: "test question",
    timestamp: Date.now() + 1000,
    group: "group_1",
  },
  {
    id: "2",
    question: "test question 2",
    timestamp: Date.now() - 100000,
    group: "group_1",
  },
  {
    id: "3",
    question: "test question 3",
    timestamp: Date.now() - 200000,
    group: "group_1",
  },
];
