import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import styles from './styles.module.css';

export function Cycles() {
  const { state } = useTaskContext();

  const cycleStep = Array.from({ length: state.currentCycle });

  const cycleDescriptionMap = {
    workTime: 'foco',
    shortBreakTime: 'descanso curto',
    longBreakTime: 'descanso longo',
  };

  return (
    <div className={styles.cycles}>
      <span>Ciclos:</span>

      <div className={styles.cycleDots}>
        {cycleStep.map((_, index) => {
          const cycleNumber = getNextCycle(index);
          const cycleType = getNextCycleType(cycleNumber);

          return (
            <span
              key={cycleNumber}
              className={`${styles.cycleDot} ${styles[cycleType]}`}
              aria-label={`Indicador de ciclo de ${cycleDescriptionMap[cycleType]}`}
              title={`Indicador de ciclo de ${cycleDescriptionMap[cycleType]}`}
            />
          );
        })}
      </div>
    </div>
  );
}