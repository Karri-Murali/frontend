import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";
import { useRef } from "react";

const SideDrawer = (props) => {
  const nodeRef = useRef(null);
  const content = (
    <CSSTransition
      in={!!props.show}
      timeout={200}
      classNames="side-in-left"
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>
        <div>{props.children}</div>
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
