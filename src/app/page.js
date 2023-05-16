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
  }
  render() {
    return (
      <>
        <Header></Header>
        <main>
          <this.CourtHalf></this.CourtHalf>
          <this.CallToAction></this.CallToAction>
          <this.CourtHalf></this.CourtHalf>
        </main>
        <Footer></Footer>
      </>
    );
  }

  CallToAction() {
    return (
      <>
        <div className="kitchen">
          <section className="call-to-action">
            <div>
              <h1>Join a Rally Near You!</h1>
            </div>
            <div className="net"></div>
            <div>
              <Button content="Create Account" href="#"></Button>
            </div>
            <div className="ball"></div>
          </section>
        </div>
      </>
    );
  }

  CourtHalf() {
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
  Ball() {
    return;
  }
}
