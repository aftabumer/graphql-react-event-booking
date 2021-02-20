import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import Navigation from "./components/Navigation";
import AuthContext from "./context/auth-context";
import { useState } from "react";

function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userId, token, tokenExpiration) => {
    setUserId(userId);
    setToken(token);
  };
  const logout = () => {
    setUserId(null);
    setToken(null);
  };
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ userId, token, login, logout }}>
        <Navigation />
        <main className="main-content">
          <Switch>
            {token && <Redirect exact from="/" to="/events" />}
            {token && <Redirect exact from="/auth" to="/events" />}
            {!token && <Route path="/auth" component={Auth} />}
            <Route path="/events" component={Events} />
            {token && <Route path="/bookings" component={Bookings} />}
            {!token && <Redirect exact to="/auth" />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
