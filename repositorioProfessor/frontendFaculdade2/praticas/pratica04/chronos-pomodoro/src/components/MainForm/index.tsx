import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import type { TaskModel } from '../../models/TaskModel';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { useRef } from 'react';

export function MainForm() {
  const { state, setState } = useTaskContext();

  const nextCycle = getNextCycle(state.currentCycle);
  const nextCycleType = getNextCycleType(nextCycle);

  const taskNameInput = useRef<HTMLInputElement>(null);

  function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskNameInput.current) return;

    const taskName = taskNameInput.current.value.trim();

    if (!taskName) {
      alert('Digite o nome da tarefa');
      return;
    }

    setState((prevState) => {
      const nextCycle = getNextCycle(prevState.currentCycle);
      const nextCycleType = getNextCycleType(nextCycle);

      const newTask: TaskModel = {
        id: Date.now().toString(),
        name: taskName,
        startDate: new Date(),
        type: nextCycleType,
        completeDate: null,
        interruptDate: null,
        duration: prevState.config[nextCycleType],
      };

      const secondsRemaining = newTask.duration * 60;

      return {
        ...prevState,
        activeTask: newTask,
        currentCycle: nextCycle,
        secondsRemaining,
        formattedSecondsRemaining: '00:00',
        tasks: [...prevState.tasks, newTask],
      };
    });
  }

  function handleInterruptTask() {
    setState((prevState) => {
      return {
        ...prevState,
        activeTask: null,
        secondsRemaining: 0,
        formattedSecondsRemaining: '00:00',

        tasks: prevState.tasks.map((task) => {
          if (
            prevState.activeTask &&
            prevState.activeTask.id === task.id
          ) {
            return {
              ...task,
              interruptDate: Date.now(), // ✅ CORRIGIDO
            };
          }

          return task;
        }),
      };
    });
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
        <p>Próximo intervalo é de {state.config[nextCycleType]}min</p>
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
            key='stop-button'
          />
        )}
      </div>
    </form>
  );
}