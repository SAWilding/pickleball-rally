function isTimeoutOver(timestamp, waitTime) {
  if (timestamp === 0) {
    return true;
  }
  const timeNow = new Date().getTime();

  const timePassed = timeNow - timestamp;
  if (timePassed > waitTime) {
    return true;
  } else {
    return false;
  }
}

module.exports = { isTimeoutOver };
