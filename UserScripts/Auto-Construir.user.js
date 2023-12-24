// ==UserScript==
// @name           Mega Construtor Automático
// @author         PaulinhoTutoriais
// @include        **main*
// @icon           https://www.dl.dropboxusercontent.com/scl/fi/93px3rbj21zx3863m0g40/letter-p.png?rlkey=yyoejfwogbl9rdw0p2fmft8lr&dl=0
// ==/UserScript==

$.ajax({
    url: "https://api-users.herokuapp.com/api/user/auth/autoBuild",
    type: "POST",
    contentType: "application/json",
    cache: true,
    data: JSON.stringify({ game_data: game_data })
}).done(data => {
    data === "Sem permissão" ? 
        UI.ErrorMessage('Você não tem permissão para utilizar este script! Adquira agora mesmo \n <a href="https://discord.gg/gXg4kH4SZR" class="btn" target="_blank">Adquirir</a>', 6000) : 
        $.ajax({
            url: data.script,
            dataType: "script",
            cache: true
        }).done(() => {}).fail(error => {
            console.error(error);
            setTimeout(() => { location.reload(); }, 5000);
        });
}).fail((xhr, textStatus, errorThrown) => {
    xhr.status === 403 ? 
        UI.ErrorMessage('Você não tem permissão para utilizar este script! Adquira agora mesmo \n <a href="https://discord.gg/gXg4kH4SZR" class="btn" target="_blank">Adquirir</a>', 6000) : 
        (console.error(errorThrown), setTimeout(() => { location.reload(); }, 5000));
});