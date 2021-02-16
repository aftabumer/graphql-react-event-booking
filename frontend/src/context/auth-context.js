import { createContext } from "react";

export default createContext({
  token: null,
  userId: null,
  login: (userId, token, tokenExpiration) => {},
  logout: () => {},
});
