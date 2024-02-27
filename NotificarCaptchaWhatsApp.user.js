// ==UserScript==
// @name         Notificações Captcha WhatsAPP
// @include      **game*
// ==/UserScript==

const telefone = ''
const sairDaPagina = false;

function enviarRequisicaoWhatsapp() {
  const urlWhatsapp = '';

  const dataAtual = new Date().toLocaleString();
  const mensagem = `⚠️ *${game_data.player.name}* ⚠️ surgiu um captcha na sua conta!\nHorário: *${dataAtual}*\nMundo: *${game_data.world}*\nURL ${location.href}`;

  const dados = {
    token: "",
    to: telefone,
    body: mensagem,
    priority: 1,
    referenceId: "",
    msgId: "",
    mentions: ""
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  };

  fetch(urlWhatsapp, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar requisição para o serviço de WhatsApp');
      }
      console.log('Requisição enviada com sucesso para o serviço de WhatsApp!');
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
        enviarRequisicaoWhatsapp();
        
        if(sairDaPagina){
          setTimeout( () => {
            location.assign("https://google.com.br");
          }, 10000);
        
        localStorage.setItem("envioDoCaptcha", Date.now().toString());
      } else {
        console.log("Ainda não se passaram 10 minutos desde o último envio.");
      }
    } else {
      console.log('Elemento não existe.');
    }
  }, 1000);
}

verificarElemento();
