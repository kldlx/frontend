import { useEffect, useReducer, useRef } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './TaskActions';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  const workerRef = useRef(TimerWorkerManager.getInstance());

  // RECEBER mensagens do worker
  useEffect(() => {
    const worker = workerRef.current;

    worker.onmessage((e) => {
      const countDownSeconds = e.data;

      if (countDownSeconds <= 0) {
        dispatch({
          type: TaskActionTypes.COMPLETE_TASK,
        });

        worker.terminate();
        workerRef.current = TimerWorkerManager.getInstance();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, []);

  // ENVIAR estado pro worker
  useEffect(() => {
    const worker = workerRef.current;

    if (!state.activeTask) {
      worker.terminate();
      workerRef.current = TimerWorkerManager.getInstance();
      return;
    }

    worker.postMessage(state);
  }, [state]);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}