// Importe o seu modelo de tarefa (ajuste o caminho se necessário)
import type { TaskModel } from '../../models/TaskModel';

export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
  COUNT_DOWN: 'COUNT_DOWN',
  COMPLETE_TASK: 'COMPLETE_TASK',
} as const;

export type TaskActionsWithPayload =
  | {
      type: typeof TaskActionTypes.START_TASK;
      payload: TaskModel;
    }
  | {
      type: typeof TaskActionTypes.COUNT_DOWN;
      payload: { secondsRemaining: number };
    };

export type TaskActionsWithoutPayload =
  | { type: typeof TaskActionTypes.RESET_STATE }
  | { type: typeof TaskActionTypes.INTERRUPT_TASK }
  | { type: typeof TaskActionTypes.COMPLETE_TASK };

// A união que define todas as ações possíveis no reducer
export type TaskActionModel = TaskActionsWithPayload | TaskActionsWithoutPayload;