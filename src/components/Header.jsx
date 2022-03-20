import React, { useState, useEffect } from "react";

function logout() {
  window.localStorage.clear();
  console.log("signed out.");
  window.location.replace("/");
}

function Header(props) {
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState();

  async function getAccounts() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length != 0) {
      return accounts[0];
    }
  }

  async function getUsername(acc) {
    const user_name = await props.contract.methods
      .getUsername(acc)
      .call({ from: acc });
    if (user_name != "") {
      setAccount(acc);
      return user_name
    }
  }

  useEffect(() => {
    getAccounts().then((acc) => {getUsername(acc).then((user) => setUsername(user))});
  }, []);
  if (localStorage.getItem('room') !== null && window.location.pathname === '/chat') {
    return (
      <div className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a href="/">
          <img
            src={`logo.png`}
            id="logo"
            className="img-fluid"
            alt="DeChat.eth"
          />
        </a>
        {username !== undefined ?
        <div className="mx-auto order-0">
          <span>
            Welcome <strong>{username}</strong> &nbsp;
          </span>
          <img
            src={`https://avatars.dicebear.com/api/initials/${username}.svg`}
            className="avatar"
            alt="avatar"
          />
        </div> : null}
        <div className="form-inline" id="logoutbtn">
          <button className="btn btn-warning" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }
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
          &nbsp;&nbsp;
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