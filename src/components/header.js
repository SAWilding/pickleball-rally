import "@/app/globals.css";
import React from "react";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";
import { auth, signInWithPopup, GoogleAuthProvider } from "../db/connect";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleNav: false,
      isVisibleLog: false,
      isVisibleDropdown: false,
      email: "",
      password: "",
      user: null,
      isSessionLoaded: false,
      loggedin: false,
      windowSize: 0,
      isGoogleLogin: false,
      googleTimeout: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleResize = () => {
    this.setState({ windowSize: window.innerWidth });
  };

  componentDidMount() {
    this.setState({ windowSize: window.innerWidth });
    window.addEventListener("resize", this.handleResize);

    const user = sessionStorage.getItem("user");
    const fullpathname = window.location.pathname;
    const pathname = fullpathname.split("/").pop();
    if (pathname != "" && user === null) {
      window.alert("Please register/login first.");
      window.location.href = "/";
    }
    if (user) {
      this.setState({ user });
    }
    this.setState({ isSessionLoaded: true });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  toggleVisibilityLog = () => {
    this.setState({ isVisibleLog: !this.state.isVisibleLog });
  };

  toggleVisibilityNav = () => {
    this.setState({ isVisibleNav: !this.state.isVisibleNav });
  };

  toggleDropdown = () => {
    this.setState({ isVisibleDropdown: !this.state.isVisibleDropdown });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  logout() {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  }

  render() {
    const { user, isSessionLoaded, windowSize } = this.state;
    if (!isSessionLoaded) {
      return <div className="loading">Loading...</div>;
    }
    if (windowSize <= 800) {
      return (
        <>
          <header>
            <button className="drop-down-btn" onClick={this.toggleDropdown}>
              <div className="hamburger">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="50"
                  height="75"
                >
                  <path
                    fill="currentColor"
                    d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"
                  />
                </svg>
              </div>
            </button>
          </header>
          {this.state.isVisibleDropdown && this.renderDropdown()}
        </>
      );
    }
    return (
      <header>
        {this.renderLogo()}
        {user && this.renderNavigation()}
        {this.state.isVisibleLog && this.renderLogin()}
        {this.renderAccountBtn()}
      </header>
    );
  }

  renderAccountBtn() {
    const { user } = this.state;
    return (
      <div className="account-btn">
        {user ? (
          <Button
            content="Logout"
            action={this.logout}
            className="account-btn"
          ></Button>
        ) : (
          <Button
            content="Login"
            action={this.toggleVisibilityLog}
            className="account-btn"
          ></Button>
        )}
      </div>
    );
  }

  renderDropdownLoggedIn = () => {
    return (
      <>
        {this.renderLinks()}
        {this.renderAccountBtn()}
      </>
    );
  };
  renderDropdown() {
    const { user } = this.state;
    return (
      <nav className="dropdown">
        {user ? this.renderDropdownLoggedIn() : this.renderLogin()}
      </nav>
    );
  }

  renderNavigation() {
    return <nav className="grow">{this.renderLinks()}</nav>;
  }

  renderLinks() {
    return (
      <>
        <ul>
          <li className="nav-link">
            <img
              src="pickleball.png"
              alt="pickleball"
              className="nav-pickleball"
            />
            <Link href="/find">Find</Link>
          </li>
          <li className="nav-link">
            <img
              src="pickleball.png"
              alt="pickleball"
              className="nav-pickleball"
            />
            <Link href="/create">Create</Link>
          </li>
          <li className="nav-link">
            <img
              src="pickleball.png"
              alt="pickleball"
              className="nav-pickleball"
            />
            <Link href="joined">Joined</Link>
          </li>
        </ul>
      </>
    );
  }

  renderLogo() {
    return (
      <Image
        src="/PR-logo.png"
        alt="Logo image"
        className="logo"
        width={200}
        height={200}
      />
    );
  }

  async handleLogin() {
    try {
      // Check if the user is logging in with Google
      if (this.state.isGoogleLogin) {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const userId = result.user.uid;
        const email = result.user.email;
        this.setState({ email: email });
        sessionStorage.setItem("user", userId);
        await this.checkNewGoogleUser();
        window.location.reload();
      } else {
        // The user is logging in with email and password
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.user,
          }),
        });

        const data = await response.json();
        if (data.success) {
          // Redirect the user to a different page after successful login
          this.toggleVisibilityLog();
          console.log("Login success", data);
          sessionStorage.setItem("user", data.user.uid);
          window.location.reload();
        } else {
          window.alert(
            "The email or password you entered was incorrect. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  checkNewGoogleUser = async () => {
    const response = await fetch("/api/checkNewUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem("user"),
        email: this.state.email,
      }),
    });
    const data = await response.json();
    if (data.success) {
      console.log("Successfully checked for new Google user.");
    } else {
      window.alert(
        "There was an error logging in with Google.  Please use another login option."
      );
    }
  };

  handleGoogleLogin = async (e) => {
    e.preventDefault();
    this.setState(
      {
        isGoogleLogin: true,
        googleTimeout: true,
      },
      () => {
        this.handleLogin();
        setTimeout(() => {
          this.setState({ googleTimeout: false });
        }, 10 * 1000);
      }
    );
  };

  handleNormalLogin = async (e) => {
    e.preventDefault();
    this.setState({ isGoogleLogin: false }, () => {
      this.handleLogin();
    });
  };

  renderLogin() {
    return (
      <>
        <section className="overlay">
          <div className="pop-up">
            <button className="exit" onClick={this.toggleVisibilityLog}>
              X
            </button>
            <h2>Log into Your Pickleball Rally Account</h2>
            <p>{this.message}</p>
            <form action="/" className="form" onSubmit={this.handleNormalLogin}>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
                // pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                onChange={this.handleChange}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                title="Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                required
                onChange={this.handleChange}
              />
              <input
                type="submit"
                id="submit"
                value="Log In"
                className="compButton"
              />
            </form>
            <hr style={{ borderColor: "black" }} />
            <p>or</p>
            {!this.state.googleTimeout ? (
              <button onClick={this.handleGoogleLogin} className="google-login">
                <img src="/googleIcon.png" className="google-icon"></img>Login
                with Google
              </button>
            ) : (
              <p className="google-loading">Loading...</p>
            )}
          </div>
        </section>
      </>
    );
  }
}
