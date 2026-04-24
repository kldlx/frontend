import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  const taskContext = useTaskContext();

  return (
    <MainTemplate>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}