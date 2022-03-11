import React from "react";

function Header() {
  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <a href="/">
        <img
          src={`logo.png`}
          id="logo"
          className="img-fluid"
          alt="DeChat.eth"
        />
      </a>
      <ul className="navbar-nav ms-auto">
        <span className="text-muted">
          by&nbsp;
          <a
            href="https://github.com/uknow4real"
            target="_blank"
            className="link-secondary"
          >
            Sebastian Chmel
          </a>
          &nbsp;&&nbsp;
          <a
            href="https://github.com/leobowenwang"
            target="_blank"
            className="link-secondary"
          >
            Leo Wang
          </a>
          &nbsp;
        </span>
      </ul>
    </div>
  );
}
export default Header;
