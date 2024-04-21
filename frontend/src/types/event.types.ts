export type NewEventData = {
  question: string;
  group_id: number;
  created_at: number;
  expires_at: number;
};

export type ExistingEventData = {
  id: number;
  question: string;
  group: string;
  created_at: number;
  expires_at: number;
  voted_yes: string[];
};
