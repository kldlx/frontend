let isRunning = false;
let timeoutId = null; // Para podermos cancelar o timer se necessário

self.onmessage = function (event) {
  const state = event.data;
  const { activeTask, secondsRemaining } = state;

  // Se recebermos uma mensagem sem activeTask, paramos tudo
  if (!activeTask) {
    isRunning = false;
    if (timeoutId) clearTimeout(timeoutId);
    return;
  }

  // Se já estiver rodando, não iniciamos outro loop (evita acelerar o timer)
  if (isRunning) return;

  isRunning = true;

  // Calculamos o momento exato em que a tarefa deve terminar
  const endDate = activeTask.startDate + secondsRemaining * 1000;

  function tick() {
    if (!isRunning) return; // Para o loop caso a tarefa seja cancelada

    const now = Date.now();
    let countDownSeconds = Math.round((endDate - now) / 1000);

    if (countDownSeconds <= 0) {
      self.postMessage(0);
      isRunning = false;
      return;
    }

    self.postMessage(countDownSeconds);
    
    // Agendamos o próximo tick
    timeoutId = setTimeout(tick, 1000);
  }

  tick();
};