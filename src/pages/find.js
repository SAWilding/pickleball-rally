import "@/app/globals.css";
import Header from "@/components/header";
import React from "react";
import Footer from "@/components/footer";
import RallyCard from "@/components/rallyCard";

export default class Find extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <Header></Header>
        <main>
          <h1 className="text-center">Find a Rally Near You</h1>
          {this.renderLocation()}
          {this.renderResults()}
        </main>
        <Footer></Footer>
      </>
    );
  }
  renderLocation() {
    return (
      <>
        <section className="max-w-screen-lg location">
          <p className="text-center">
            Allow us to use your location <br /> or
          </p>
          <div className="horizontal-line"></div>
          <div className="flex items-center">
            <form action="" className="locationForm text-center">
              <input type="zip" placeholder="Enter zip" />
              <input type="submit" className="compButton" />
            </form>
          </div>
        </section>
      </>
    );
  }

  renderResults() {
    return (
      <>
        <section className="results max-w-screen-lg">
          <p>Results:</p>
          <hr />
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
          <RallyCard></RallyCard>
        </section>
      </>
    );
  }
}
