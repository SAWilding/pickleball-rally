"use client";

import "@/app/globals.css";
import "@/styles/court.css";
import "@/styles/small.css";
import Help from "@/components/help";
import Header from "@/components/header";
import Button from "@/components/button";
import Footer from "@/components/footer";
import React from "react";
import helpMessage from "../library/help-message.json";
import { auth, signInWithPopup, GoogleAuthProvider } from "../db/connect";

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
      helpMessage: helpMessage["help-messages"]["home"],
      googleTimeout: false,
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
    this.setState({ googleTimeout: true });
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userId = result.user.uid;
      const email = result.user.email;
      this.setState({ email: email });
      sessionStorage.setItem("user", userId);
      await this.checkNewGoogleUser();
      window.location.reload();
    } catch (error) {
      console.log("There was an error signing in with Google.", error);
    }
    setTimeout(() => {
      this.setState({ googleTimeout: false });
    }, 10 * 1000);
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
              <h1>
                Join a Rally Near You!
                <Help id="help-home" message={this.state.helpMessage}></Help>
              </h1>
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
                value="Register"
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
