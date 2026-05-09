import alertAudio from '../assets/audios/audio.mp3';

/**
 * Prepara o som de notificação. 
 * Carrega o asset e retorna uma função para dar play.
 */
export function loadBeep() {
  const audio = new Audio(alertAudio);
  audio.load();

  return () => {
    audio.currentTime = 0; // Volta para o início
    audio.play().catch(error => console.log('Erro ao tocar áudio', error));
  };
}