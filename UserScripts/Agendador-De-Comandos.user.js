// ==UserScript==
// @name           Agendador de Comandos
// @author         PaulinhoTutoriais
// @include        **place*
// @include        **info_village*
// @include        **map*
// @include        **memo*
// @include        **combined*
// @include        **prod*
// @exclude        **scavenge*
// @exclude        **place&mode=sim*
// @exclude        **place&mode=units*
// @exclude        **place&mode=call*
// @exclude        **place&mode=templates*
// @exclude        **snob*
// @exclude        **guest*
// @downloadURL    https://github.com/p4ulinho/Scripts-Premium-TribalWars/raw/main/UserScripts/Agendador-Comandos.user.js
// @updateURL      https://github.com/p4ulinho/Scripts-Premium-TribalWars/raw/main/UserScripts/Agendador-Comandos.user.js
// @icon           https://www.dl.dropboxusercontent.com/scl/fi/93px3rbj21zx3863m0g40/letter-p.png?rlkey=yyoejfwogbl9rdw0p2fmft8lr&dl=0
// ==/UserScript==

$.ajax({
    url: "https://paulinhoscripts.com.br/api/user/auth/place",
    type: "POST",
    contentType: "application/json",
    cache: true,
    data: JSON.stringify({ game_data: game_data })
}).done(data => {
    if (data === "Sem permissão") {
        UI.ErrorMessage('Você não tem permissão para utilizar este script! Adquira agora mesmo \n <a href="https://discord.gg/gXg4kH4SZR" class="btn" target="_blank">Adquirir</a>', 6000);
    } else {
        $.ajax({
            url: data.script,
            dataType: "script",
            cache: true
        }).done(() => {
        }).fail(error => {
            console.error(error);
            setTimeout(() => { location.reload(); }, 5000);
        });
    }
}).fail((xhr, textStatus, errorThrown) => {
    if (xhr.status === 403) {
        UI.ErrorMessage('Você não tem permissão para utilizar este script! Adquira agora mesmo \n <a href="https://discord.gg/gXg4kH4SZR" class="btn" target="_blank">Adquirir</a>', 6000);
    } else {
        console.error(errorThrown);
        setTimeout(() => { location.reload(); }, 5000);
    }
});


