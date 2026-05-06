import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { TaskActionTypes } from '../../contexts/TaskContext/TaskActions';
import type { TaskModel } from '../../models/TaskModel';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { Tips } from '../Tips';
import { useRef } from 'react';

export function MainForm() {
  const { state, dispatch } = useTaskContext();

  const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskNameInput.current) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      alert('Digite o nome da tarefa');
      return;
    }

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    const newTask: TaskModel = {
      id: Date.now().toString(),
      name: taskName,
      startDate: Date.now(),
      completeDate: null,
      interruptDate: null,
      duration: state.config[nextCycleType],
      type: nextCycleType,
    };

    // ✅ dispara reducer
    dispatch({
      type: TaskActionTypes.START_TASK,
      payload: newTask,
    });

    // ✅ usa o singleton do worker
    const timerWorkerManager = TimerWorkerManager.getInstance();

    timerWorkerManager.onmessage((event) => {
      console.log('PRINCIPAL recebeu:', event.data);
    });
  }

  function handleInterruptTask() {
    dispatch({ type: TaskActionTypes.INTERRUPT_TASK });

    // (opcional, mas já correto pro futuro)
    TimerWorkerManager.getInstance().terminate();
  }

  return (
    <form className='form' onSubmit={handleCreateNewTask}>
      <div className='formRow'>
        <DefaultInput
          ref={taskNameInput}
          labelText='task'
          id='meuInput'
          type='text'
          placeholder='Digite algo'
          disabled={!!state.activeTask}
        />
      </div>

      <div className='formRow'>
        <Tips />
      </div>

      {state.currentCycle > 0 && (
        <div className='formRow'>
          <Cycles />
        </div>
      )}

      <div className='formRow'>
        {!state.activeTask && (
          <DefaultButton
            aria-label='Iniciar nova tarefa'
            title='Iniciar nova tarefa'
            type='submit'
            icon={<PlayCircleIcon />}
          />
        )}

        {!!state.activeTask && (
          <DefaultButton
            aria-label='Interromper tarefa atual'
            title='Interromper tarefa atual'
            type='button'
            color='red'
            icon={<StopCircleIcon />}
            onClick={handleInterruptTask}
          />
        )}
      </div>
    </form>
  );
}