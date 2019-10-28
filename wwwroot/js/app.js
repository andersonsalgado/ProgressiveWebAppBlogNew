var blogService = require('./blogService.js');
var serviceWorker = require('./swRegister.js'); 

blogService.loadLatestBlogPosts();

window.pageEvents = {

    loadBlogPost: function (link) {
        console.log('imprimindo o link do clique' + link);
        blogService.loadBlogPost(link);
    },

    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    }
};

