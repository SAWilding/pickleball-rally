import React from "react";

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: props.duration,
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      this.setState(
        (prevState) => ({
          remainingTime: prevState.remainingTime - 1,
        }),
        () => {
          if (this.state.remainingTime === 0) {
            this.clearTimer();
          }
        }
      );
    }, 1000);
  };

  clearTimer = () => {
    clearInterval(this.timer);
  };

  formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  render() {
    const { remainingTime } = this.state;

    return (
      <div>
        {remainingTime > 0 ? (
          <div>Timeout Remaining: {this.formatTime(remainingTime)}</div>
        ) : (
          <div>Timeout completed</div>
        )}
      </div>
    );
  }
}

export default CountdownTimer;
