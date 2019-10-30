﻿var blogService = require('./blogService.js');
var serviceWorker = require('./swRegister.js'); 

blogService.loadLatestBlogPosts();

window.pageEvents = {

    loadBlogPost: function (link) {
        console.log('imprimindo o link do clique' + link);
        blogService.loadBlogPost(link);
    },

    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    },

    tryAddHomeScreen: function() {
        defferedPrompt.prompt();
        defferedPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou o A2HS prompt');
                $('#install-container').hide();
            }
            defferedPrompt = null;
        });
    },

    setBackgroundFetch: function (link) {
        debugger;
        navigator.serviceWorker.ready.then(async (swReg) => {
            const bgFetch = await swReg.backgroundFetch.fetch(link,
                ['/Home/Post/?postId=' + link], {
                title: link,
                icons: [{
                    sizes: '192x192',
                    src: 'images/icons/icon-192x192.png',
                    type: 'image/png',
                }],
                downloadTotal: 150000
            });

            bgFetch.addEventListener('progress', () => {
                if (!bgFetch.downloadTotal) return;

                const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
                console.log('Download progress: ' + percent + '%');
                console.log('Download status: ' + bgFetch.result);

                $('.download-start').hide();
                $('#status-download').show();
                $('#status-download > .progress > .progress-bar').css('width', percent + '%');

                if (bgFetch.result === 'success') {

                    $('#status-download > .text-success').show();
                }
            });
        });
    },

    requestPushPermission: function () {
        serviceWorker.requestPushPermission();
    }

};

//window events
let defferedPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    defferedPrompt = e;
    //atualizar a tela para notificar o usuario
    // que ele pode adicionar à tela de home
    $('#install-container').show();
});

window.addEventListener('appinstalled', (evt) => {
    console.log('app foi adicionada na home screen! Yuhuu!');
});


//if (!'BackgroundFetchManager' in self) {
//    alert('background fetch não está disponível neste site');
//    return;
//}
