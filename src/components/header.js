"use client";
import "@/app/globals.css";
import React from "react";
import Image from "next/image";
import Button from "./button";
import Link from "next/link";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleLog: false,
    };
  }

  toggleVisibilityLog = () => {
    this.setState({ isVisibleLog: !this.state.isVisibleLog });
  };

  render() {
    return (
      <header>
        {this.renderLogo()}
        {this.renderNavigation()}
        {this.state.isVisibleLog && this.renderLogin()}
        <Button content="Login" action={this.toggleVisibilityLog}></Button>
      </header>
    );
  }
  renderNavigation() {
    return (
      <nav className="grow">
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
      </nav>
    );
  }
  renderLogo() {
    return <Image src="/logo.png" alt="Logo image" className="logo" fill />;
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
            <form action="." className="form">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
              />
              <input
                type="text"
                name="password"
                id="password"
                placeholder="Password"
              />
              <input
                type="submit"
                id="submit"
                value="Log In"
                className="compButton"
              />
            </form>
            <p>
              Don't have an account? <a href="/">Create one here.</a>
            </p>
          </div>
        </section>
      </>
    );
  }
}
