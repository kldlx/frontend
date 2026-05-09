import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions'; // Ajuste para o nome correto do seu arquivo
import { loadBeep } from '../../utils/loadBeep';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  
  // useRef guarda a função de dar play sem causar novos renders
  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);

  const worker = TimerWorkerManager.getInstance();

  // Efeito 1: Escutar o Worker
  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        // Se a função de som existir, toca agora no final!
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null; // Limpa após tocar
        }

        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  // Efeito 2: Sincronizar estado com o Worker
  useEffect(() => {
    if (!state.activeTask) {
      worker.terminate();
      return;
    }
    worker.postMessage(state);
  }, [worker, state]);

  // Efeito 3: Gerenciar o "desbloqueio" do áudio (Safari/Chrome)
  useEffect(() => {
    // Se não tem tarefa ativa, limpamos a referência
    if (!state.activeTask) {
      playBeepRef.current = null;
      return;
    }

    // Se iniciou uma tarefa e ainda não carregamos o beep
    if (playBeepRef.current === null) {
      const play = loadBeep();
      playBeepRef.current = play;
      
      // Dá o "primeiro play" logo que a tarefa inicia (perto do clique do usuário)
      // Isso desbloqueia o áudio para tocar sozinho lá no final.
      play();
    }
  }, [state.activeTask]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}