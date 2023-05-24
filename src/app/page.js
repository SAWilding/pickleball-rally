"use client";

import "@/app/globals.css";
import "@/styles/court.css";
import Header from "@/components/header";
import Button from "@/components/button";
import Footer from "@/components/footer";
import React from "react";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleReg: false,
    };
  }

  toggleVisibilityReg = () => {
    this.setState({ isVisibleReg: !this.state.isVisibleReg });
  };

  render() {
    return (
      <>
        <Header></Header>
        <main>
          {this.state.isVisibleReg && this.renderRegister()}
          {this.renderCourtHalf()}
          {this.renderCallToAction()}
          {this.renderCourtHalf()}
        </main>
        <Footer></Footer>
      </>
    );
  }

  renderCallToAction() {
    return (
      <>
        <div className="kitchen">
          <section className="call-to-action">
            <div>
              <h1>Join a Rally Near You!</h1>
            </div>
            <div className="net"></div>
            <div>
              <Button
                content="Create Account"
                action={this.toggleVisibilityReg}
              ></Button>
            </div>
            <div className="ball">
              <img src="/pickleball.png" alt="" />
            </div>
          </section>
        </div>
      </>
    );
  }

  renderCourtHalf() {
    return (
      <>
        <div className="court-line-horizontal"></div>
        <div className="court-squares">
          <div className="court-line-vertical"></div>
          <div className="court-square"></div>
          <div className="court-line-vertical"></div>
          <div className="court-square"></div>
          <div className="court-line-vertical"></div>
        </div>
        <div className="court-line-horizontal"></div>
      </>
    );
  }

  renderRegister() {
    return (
      <>
        <section className="overlay">
          <div className="pop-up">
            <button className="exit" onClick={this.toggleVisibilityReg}>
              X
            </button>
            <h2>Create a Pickleball Rally Account</h2>
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
                value="Register"
                className="compButton"
              />
            </form>
            <p>
              Already have an account? <a href="/">Log in here.</a>
            </p>
          </div>
        </section>
      </>
    );
  }
}
