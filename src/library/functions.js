function isTimeoutOver(timestamp, waitTime) {
  if (timestamp === 0) {
    return [true, 0];
  }
  const timeNow = new Date().getTime();

  const timePassed = timeNow - timestamp;
  if (timePassed > waitTime) {
    return [true, waitTime];
  } else {
    const timeRemaining = waitTime - timePassed;
    return [false, timeRemaining];
  }
}

module.exports = { isTimeoutOver };
