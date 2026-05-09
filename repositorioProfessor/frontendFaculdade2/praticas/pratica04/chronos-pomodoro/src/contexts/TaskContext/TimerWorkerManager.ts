import type { TaskStateModel } from '../../models/TaskStateModel';

export class TimerWorkerManager {
  private static instance: TimerWorkerManager | null = null;
  private worker: Worker;

  // Transformamos o constructor em private para ninguém usar 'new' fora daqui
  private constructor() {
    this.worker = new Worker(
      new URL('../../workers/timerWorker.js', import.meta.url) // Ajustado para a mesma pasta se estiverem juntos
    );
  }

  // Criando o método que o seu Provider está tentando chamar
  public static getInstance(): TimerWorkerManager {
    if (!TimerWorkerManager.instance) {
      TimerWorkerManager.instance = new TimerWorkerManager();
    }
    return TimerWorkerManager.instance;
  }

  onmessage(callback: (e: MessageEvent) => void) {
    this.worker.onmessage = callback;
  }

  postMessage(message: TaskStateModel) {
    this.worker.postMessage(message);
  }

  terminate() {
    this.worker.terminate();
    // Importante: Limpar a instância ao terminar para poder criar um novo worker depois
    TimerWorkerManager.instance = null;
  }
}