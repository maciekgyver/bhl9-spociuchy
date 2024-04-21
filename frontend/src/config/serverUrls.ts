const SERVER_URL = "/api";

export enum ServerUrls {
  GET_ACTIVITIES = "/get-activities",
  GET_ACTIVITY = "/get-activity",
  GET_ACTIVE_POLL = "/get-active-poll",
  GET_GROUPS = "/get-groups",
  ADD_ACTIVITY = "/add-activity",
}

export const getServerUrl = (baseUrl: ServerUrls, param?: string) => {
  return `${SERVER_URL}${baseUrl}${param ? `/${param}` : ""}`;
};
