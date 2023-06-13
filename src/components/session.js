import { Component } from "react";
import { auth, onIdTokenChanged } from "../db/connect";

class Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: getAuth().currentUser,
    };
  }

  componentDidMount() {
    this.unsubscribe = onIdTokenChanged(auth, (user) => {
      if (user) {
        // User is logged in
        this.setState({ user });
      } else {
        // User is logged out
        this.setState({ user: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { user } = this.state;
    return this.props.children(user);
  }
}

export default Session;
