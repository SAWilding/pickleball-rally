import "@/app/globals.css";
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
        <p>Welcom to the Joined page!</p>
      </>
    );
  }
}
