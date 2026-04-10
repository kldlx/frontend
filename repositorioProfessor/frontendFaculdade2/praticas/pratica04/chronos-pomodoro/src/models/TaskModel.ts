import type { TaskStateModel } from './TaskStateModel';


export type TaskModel = {
  id: string; // Identificador único da tarefa
  name: string; // Nome digitado no input
  duration: number; // Duração em minutos
  startDate: number; // Timestamp de quando começou (usamos number para facilitar o localStorage)
  complete: boolean; // Indica se a tarefa foi completada
  type: keyof TaskStateModel['config'];
};