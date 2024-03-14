// ==UserScript==
// @name         Notificações Captcha Discord e Alarme Repetido
// @include      **game*
// ==/UserScript==

if(game_data.screen == 'settings'){
    loadWorldSettings = document.querySelector('#dialog-sync-show')
const interface_notifications = `
<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    #table-settings th,#table-settings td {
        padding: 6px;
        text-align: left;
    }

    #table-settings th {
        background-color: #f2f2f2;
    }

    .toggle-slider {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .toggle-slider input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196F3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    // .input-nicer {
    //     border: 1px solid #ccc;
    //     border-radius: 4px;
    //     padding: 8px;
    //     width: 100%;
    //     box-sizing: border-box;
    // }

    #save-settings {
        background-color: #4CAF50;
        color: white;
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    #save-settings:hover {
        background-color: #45a049;
    }
</style>
</head>
<body>
<h2>Configurações Notificações de Captcha</h2>
<table id="table-settings">
    <tr>
        <th>Opção</th>
        <th>Ativar</th>
    </tr>
    <tr>
        <td>Ativar Notificações</td>
        <td>
            <label class="toggle-slider">
                <input type="checkbox" id="notificationsCheckbox">
                <span class="slider"></span>
            </label>
        </td>
    </tr>
    <tr>
        <td>Notificar Discord</td>
        <td>
            <label class="toggle-slider">
                <input type="checkbox" id="discordCheckbox">
                <span class="slider"></span>
            </label>
        </td>
    </tr>
    <tr>
        <td>Tocar Som</td>
        <td>
            <label class="toggle-slider">
                <input type="checkbox" id="soundCheckbox">
                <span class="slider"></span>
            </label>
        </td>
    </tr>
    <tr>
        <td>Sair da Página</td>
        <td>
            <label class="toggle-slider">
                <input type="checkbox" id="exitCheckbox">
                <span class="slider"></span>
            </label>
        </td>
    </tr>
    <tr>
        <td>URL Webhook Discord:</td>
        <td><input class="input-nicer" type="text" id="webhookURL"></td>
    </tr>
    <tr>
        <td>URL do Som:</td>
        <td><input class="input-nicer type="text" id="soundURL"></td>
    </tr>
    <tr>
        <td>URL para Sair da Página:</td>
        <td><input class="input-nicer type="text" id="exitURL"></td>
    </tr>
    <tr>
        <td>Tempo para sair da página (segundos):</td>
        <td><input class="input-nicer type="number" id="timeExit"></td>
    </tr>
    <tr>
        <td>Intervalo de Notificação (minutos):</td>
        <td><input class="input-nicer type="number" id="notificationInterval"></td>
    </tr>
    <tr>
    <td>Salvar Configurações</td>
    <td><button id="save-settings" class="btn">Salvar Configurações</button></td>
</tr>
</table>
`
loadWorldSettings.insertAdjacentHTML('afterend', interface_notifications);

document.querySelectorAll('.toggle-slider input').forEach(function(input) {
    input.addEventListener('change', saveOptions);
});

document.querySelector('#save-settings').addEventListener('click', function () {
    saveOptions();
});

function saveOptions() {
    const options = {
        notifications: document.getElementById('notificationsCheckbox').checked,
        discord: document.getElementById('discordCheckbox').checked,
        sound: document.getElementById('soundCheckbox').checked,
        exit: document.getElementById('exitCheckbox').checked,
        webhookURL: document.getElementById('webhookURL').value,
        soundURL: document.getElementById('soundURL').value,
        exitURL: document.getElementById('exitURL').value,
        timeExit: document.getElementById('timeExit').value,
        notificationInterval: document.getElementById('notificationInterval').value
    };
    localStorage.setItem('notificationOptions', JSON.stringify(options));
    UI.SuccessMessage('As configurações foram salvas com sucesso!', 2000);
}

function loadOptions() {
    const options = JSON.parse(localStorage.getItem('notificationOptions')) || {};
    document.getElementById('notificationsCheckbox').checked = options.notifications || false;
    document.getElementById('discordCheckbox').checked = options.discord || false;
    document.getElementById('soundCheckbox').checked = options.sound || false;
    document.getElementById('exitCheckbox').checked = options.exit || false;
    document.getElementById('webhookURL').value = options.webhookURL || '';
    document.getElementById('soundURL').value = options.soundURL || 'https://cdn.freesound.org/previews/196/196838_3629620-lq.mp3';
    document.getElementById('exitURL').value = options.exitURL || 'https://google.com';
    document.getElementById('timeExit').value = options.timeExit || 30
    document.getElementById('notificationInterval').value = options.notificationInterval || 10;
}

loadOptions();
}

const optionsNotification = JSON.parse(localStorage.getItem('notificationOptions')) || {};
const activeNotification = optionsNotification.notifications
const notificationDiscord = optionsNotification.discord
const notificationSound = optionsNotification.sound
const exitPage = optionsNotification.exit
const urlWeebhook = optionsNotification.webhookURL
const soundUrl = optionsNotification.soundURL
const exitUrl = optionsNotification.exitURL
const timeExit = optionsNotification.timeExit
const intervalNotification = optionsNotification.notificationInterval

function tocarAlarme() {
  const audio = new Audio(soundUrl);
  audio.play().catch(e => console.error("Erro ao tentar tocar o alarme:", e));
}

function enviarRequisicaoWebhook() {
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
      clearInterval(interval);

      const ultimoEnvio = localStorage.getItem("envioDoCaptcha");
      if (!ultimoEnvio || (Date.now() - parseInt(ultimoEnvio)) >= intervalNotification * 60000 && activeNotification == true && notificationDiscord == true) {
        enviarRequisicaoWebhook();
      }

      if (!alarmeInterval) {
        if(notificationSound == true && activeNotification == true){
            alarmeInterval = setInterval(tocarAlarme, 3000);
        }
      }

      if (exitPage == true) {
        setTimeout(() => {
          location.assign(exitUrl);
        }, timeExit * 1000);
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
