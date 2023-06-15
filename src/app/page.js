"use client";

import "@/app/globals.css";
import "@/styles/court.css";
import "@/styles/small.css";
import Header from "@/components/header";
import Button from "@/components/button";
import Footer from "@/components/footer";
import React from "react";
import { auth } from "../db/connect";
import { createUserWithEmailAndPassword } from "@firebase/auth";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.user = props.user;
    this.state = {
      isVisibleReg: false,
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleVisibilityReg = () => {
    this.setState({ isVisibleReg: !this.state.isVisibleReg });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.email && this.state.password != "") {
      try {
        createUserWithEmailAndPassword(
          auth,
          this.state.email,
          this.state.password
        );
      } catch (err) {
        console.log(err);
      }
      this.toggleVisibilityReg();
    } else {
      window.alert("Please enter an email and password.");
    }
  }

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
            <div className="create-account-btn">
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
            <form action="." className="form" onSubmit={this.handleSubmit}>
              <input
                type="text"
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
