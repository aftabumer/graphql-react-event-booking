import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";

const Navigation = () => {
  return (
    <AuthContext.Consumer>
      {(authContext) => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!authContext.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/events">Events</NavLink>
                </li>
                {authContext.token && (
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default Navigation;
