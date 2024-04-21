const SERVER_URL = "/api";
// const SERVER_URL = "http://192.168.151.97:8000";

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
