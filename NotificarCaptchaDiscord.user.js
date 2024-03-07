// ==UserScript==
// @name         Notificações Captcha Discord e Alarme Repetido
// @include      **game*
// ==/UserScript==

const sairDaPagina = false;
const urlSomAlarme = 'https://cdn.freesound.org/previews/196/196838_3629620-lq.mp3'; // Substitua pela URL do seu arquivo de áudio

function tocarAlarme() {
  const audio = new Audio(urlSomAlarme);
  audio.play().catch(e => console.error("Erro ao tentar tocar o alarme:", e));
}

function enviarRequisicaoWebhook() {
  const urlWeebhook = ''; // Coloque a URL do Webhook do Discord aqui

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

let alarmeInterval = null;
let alreadyCaptcha = false;

function verificarElementoEIniciarAlarme() {
  const interval = setInterval(function() {
    if (document.querySelector('#botprotection_quest')) {
      alreadyCaptcha = true;
      console.log('Captcha detectado!');
      clearInterval(interval);

      const ultimoEnvio = localStorage.getItem("envioDoCaptcha");
      if (!ultimoEnvio || (Date.now() - parseInt(ultimoEnvio)) >= 1 * 60000) {
        enviarRequisicaoWebhook();
      }

      if (!alarmeInterval) {
        alarmeInterval = setInterval(tocarAlarme, 0.1 * 60000);
      }

      if (sairDaPagina) {
        setTimeout(() => {
          location.assign("https://google.com.br");
        }, 10000);
      }
    }
  }, 1000);
}

function verificarResolucaoCaptcha() {
  const verificaCaptchaResolvido = setInterval(() => {
    if (!document.querySelector('#botprotection_quest') && alreadyCaptcha) {
      alreadyCaptcha = false;
      clearInterval(verificaCaptchaResolvido);
      if (alarmeInterval) {
        clearInterval(alarmeInterval);
        alarmeInterval = null;
      }
    }else{
      verificarElementoEIniciarAlarme();
    }
  }, 5000);
}

verificarElementoEIniciarAlarme();
verificarResolucaoCaptcha();
