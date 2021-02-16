import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Bookings from "./pages/Bookings";
import Navigation from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
      <>
        <Navigation />
        <main className="main-content">
          <Switch>
            <Redirect exact from="/" to="/auth" />
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Route path="/bookings" component={Bookings} />
          </Switch>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
