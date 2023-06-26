import React from "react";
import { getMessaging } from "firebase/messaging";
import { app } from "../db/connect";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  render() {
    // Render the component if the user is authenticated
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
