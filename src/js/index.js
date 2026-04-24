document.addEventListener('DOMContentLoaded', function () {

  // Código normal após a reabertura
  const statusLoja = document.getElementById('status-loja');
  const botaoCardapio = document.querySelector('.lado-direito a[href="cardapio.html"]');

  function atualizarStatusLoja() {
    const agora = new Date();
    const hora = agora.getHours();

    const abre = 9; // Hora de abertura (9h)
    const fecha = 23;
    const diaSemana = agora.getDay();


    if (diaSemana !== 0 && diaSemana !== 6 &&  hora < fecha &&  hora >= abre){ // Verifica se é um dia útil e se está dentro do horário de funcionamento que é de segunda a domingo das 9h às 23h
      statusLoja.textContent = 'Aberto';
      statusLoja.classList.remove('btn-danger');
      statusLoja.classList.add('btn-success');

      botaoCardapio.classList.remove('disabled');
      botaoCardapio.style.pointerEvents = 'auto';
    } else {
      statusLoja.textContent = 'Fechado';
      statusLoja.classList.remove('btn-success');
      statusLoja.classList.add('btn-danger');

      botaoCardapio.classList.add('disabled');
      botaoCardapio.style.pointerEvents = 'none';
    }
  }

  atualizarStatusLoja();
});
