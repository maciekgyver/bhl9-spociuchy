const SERVER_URL = "/api";
// const SERVER_URL = "http://192.168.151.97:8000";

export enum ServerUrls {
  GET_ACTIVITIES = "/get-activities",
  ADD_ACTIVITY = "/add-activity",
}

export const getServerUrl = (baseUrl: ServerUrls, param?: string) => {
  return `${SERVER_URL}${baseUrl}${param ? `/${param}` : ""}`;
};
