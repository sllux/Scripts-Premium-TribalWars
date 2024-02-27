// ==UserScript==
// @name         Notificações Captcha Discord
// @include      **game*
// ==/UserScript==

const sairDaPagina = false;

function enviarRequisicaoWebhook() {
  const urlWeebhook = '';

  const dataAtual = new Date().toLocaleString();
  const mensagem = `Surgiu um captcha na sua conta ${game_data.player.name}, no horário: ${dataAtual} na URL ${location.href}`;

  const dados = {
    content: mensagem
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  };

  fetch(urlWeebhook, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar requisição para o webhook');
      }
      console.log('Requisição enviada com sucesso para o webhook!');

      localStorage.setItem("envioDoCaptcha", Date.now().toString());
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function verificarElemento() {
  const interval = setInterval(function() {
    if (document.querySelector('#botprotection_quest')) {
      console.log('Elemento existe!');
      clearInterval(interval);

      const ultimoEnvio = localStorage.getItem("envioDoCaptcha");
      if (!ultimoEnvio || (Date.now() - parseInt(ultimoEnvio)) >= 10 * 60000) {
        enviarRequisicaoWebhook();

        if(sairDaPagina){
          setTimeout( () => {
            location.assign("https://google.com.br");
          }, 10000);
        }
      }
    }
  }, 1000);

  setTimeout(function() {
    clearInterval(interval);
    console.log('Verificação interrompida após 2500 ms.');
  }, 2500);
}

verificarElemento();
