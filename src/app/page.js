"use client";

import "@/app/globals.css";
import "@/styles/court.css";
import "@/styles/small.css";
import Header from "@/components/header";
import Button from "@/components/button";
import Footer from "@/components/footer";
import React from "react";
import { auth } from "../db/connect";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "@firebase/auth";

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

  checkAndCreateUser(auth, email, password) {
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          // User account with this email already exists
          console.log("User account with this email already exists.");
          // You can handle the case here as needed, such as showing an error message.
        } else {
          // User account with this email does not exist
          return createUserWithEmailAndPassword(auth, email, password);
        }
      })
      .then((userCredentials) => {
        if (userCredentials) {
          // User account creation successful
          const user = userCredentials.user;
          console.log("User created:", user.email);
          console.log("User ID:", user.uid);
          console.log("Additional user metadata:", user.metadata);
        }
      })
      .catch((error) => {
        // Error occurred during user account creation or checking
        console.error("Error:", error);
      });
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.email && this.state.password != "") {
      try {
        this.checkAndCreateUser(auth, this.state.email, this.state.password);
      } catch (err) {
        console.log(err);
      }
      this.toggleVisibilityReg();
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
        }
      } catch (error) {
        console.error("Login error:", error);
      }
      window.location.href = "/find";
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
            <form action="." className="form reg" onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                required
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                onChange={this.handleChange}
              />
              <p className="note">
                Password must contain at least one number and one uppercase and
                lowercase letter, and at least 8 or more characters
              </p>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                required
                onChange={this.handleChange}
              />
              <input
                type="submit"
                id="submit"
                value="Register"
                className="compButton"
              />
            </form>
          </div>
        </section>
      </>
    );
  }
}
