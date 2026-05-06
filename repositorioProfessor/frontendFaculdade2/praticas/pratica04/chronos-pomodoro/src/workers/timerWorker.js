let isRunning = false;

self.onmessage = function (event) {
  if (isRunning) return;

  isRunning = true;

  const state = event.data;
  const { activeTask, secondsRemaining } = state;

  if (!activeTask) return;

  const endDate = activeTask.startDate + secondsRemaining * 1000;

  let countDownSeconds = Math.ceil(
    (endDate - Date.now()) / 1000
  );

  function tick() {
    self.postMessage(countDownSeconds);

    const now = Date.now();
    countDownSeconds = Math.floor(
      (endDate - now) / 1000
    );

    if (countDownSeconds <= 0) {
      self.postMessage(0);
      return;
    }

    setTimeout(tick, 1000);
  }

  tick();
};