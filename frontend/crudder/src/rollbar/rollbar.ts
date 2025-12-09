import Rollbar from "rollbar";

export const rollbar = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_CLIENT_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: import.meta.env.MODE,
  },
});
