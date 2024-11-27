import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = ({ vertical }) => {
  const auth = useContext(AuthContext);

  return (
    <ul className={`nav-links ${vertical ? "vertical" : "horizontal"}`}>
      <li>
        <NavLink to="/">ALL USERS</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button className="logout-btn" onClick={auth.logout}>
            <span>LOGOUT</span>
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
