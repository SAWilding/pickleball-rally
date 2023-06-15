import "@/app/globals.css";
import React from "react";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleNav: false,
      isVisibleLog: false,
      email: "",
      password: "",
      user: null,
      isSessionLoaded: false,
      loggedin: false,
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
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

  toggleVisibilityLog = () => {
    this.setState({ isVisibleLog: !this.state.isVisibleLog });
  };

  toggleVisibilityNav = () => {
    this.setState({ isVisibleNav: !this.state.isVisibleNav });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  logout() {
    sessionStorage.removeItem("user");
    window.location.href = "/";
  }

  render() {
    const { user, isSessionLoaded } = this.state;

    if (!isSessionLoaded) {
      // Render a loading state or placeholder
      return <div>Loading...</div>;
    }
    return (
      <header>
        {this.renderLogo()}
        {user && this.renderNavigation()}
        {this.state.isVisibleLog && this.renderLogin()}
        {user ? (
          <Button content="Logout" action={this.logout}></Button>
        ) : (
          <Button content="Login" action={this.toggleVisibilityLog}></Button>
        )}
      </header>
    );
  }

  renderNavigation() {
    return <nav className="grow">{this.renderLinks()}</nav>;
  }

  renderLinks() {
    return (
      <>
        <ul>
          <li>
            <Link href="/find">Find</Link>
          </li>
          <li>
            <Link href="/create">Create</Link>
          </li>
          <li>
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

  async handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Redirect the user to a different page after successful login
        this.toggleVisibilityLog();
        console.log("Loggin succuess", data);
        sessionStorage.setItem("user", data.user.uid);
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }

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
            <form action="/" className="form" onSubmit={this.handleLogin}>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={this.handleChange}
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={this.handleChange}
              />
              <input
                type="submit"
                id="submit"
                value="Log In"
                className="compButton"
              />
            </form>
            <p>
              Don&apos;t have an account? <a href="/">Create one here.</a>
            </p>
          </div>
        </section>
      </>
    );
  }
}
