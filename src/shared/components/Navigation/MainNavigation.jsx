import { useState } from "react";
import { Link } from "react-router-dom";
import BackDrop from "../UIElements/Backdrop";
import SideDrawer from "./SideDrawer";
import NavLinks from "./NavLinks";
import MainHeader from "./MainHeader";
import "./MainNavigation.css";

const MainNavigation = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerOpen(true);
  };
  const closeDrawerHandler = () => {
    setDrawerOpen(false);
  };
  return (
    <>
      {isDrawerOpen && <BackDrop onClick={closeDrawerHandler} />}
      <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks vertical={true} />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <div className="menu-icon">
            <span />
            <span />
            <span />
          </div>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks vertical={false} />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
