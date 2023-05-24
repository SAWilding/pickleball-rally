import "@/app/globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";
export default class Joined extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <Header></Header>
        <main>
          <p>Welcom to the Joined page!</p>
        </main>
        <Footer></Footer>
      </>
    );
  }
}
