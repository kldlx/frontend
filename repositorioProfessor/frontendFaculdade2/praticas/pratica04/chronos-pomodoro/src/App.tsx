export function App() {
  return (
    <>
<<<<<<< HEAD
      <>
      <h1>Bem vindo a primeira aula de ReactJS</h1>
      <h2>Nossa aula de introdução</h2>
=======
      <Container>
        <Logo />
      </Container>
      <Container>
        <Menu />
      </Container>
      <Container>
        <CountDown />
      </Container>

      <Container>
        <form className='form' action=''>
          <div className='formRow'>
            <DefaultInput
              labelText='Digite sua atividade:'
              id='meuInput'
              type='text'
              placeholder='Digite aqui a atividade que deseja'
            />
          </div>

          <div className='formRow'>
            <p>Chronus Pomodoro, o melhor marcador de tempo</p>
          </div>

          <div className='formRow'>
            <Cycles />
          </div>

          <div className='formRow'>
            {/* Mantivemos apenas o botão principal de Play */}
            <DefaultButton icon={<PlayCircleIcon />} />
          </div>
        </form>
      </Container>

      {/* Nosso novo rodapé entra aqui, no seu próprio Container! */}
      <Container>
        <Footer />
      </Container>
>>>>>>> projetoReact
    </>
    </>
  )
}