import "@/app/globals.css";
import Header from "@/components/header";
import React from "react";
export default class Create extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <Header></Header>
        <p>Welcom to the Create page!</p>
      </>
    );
  }
}
