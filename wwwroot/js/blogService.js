define(['js/template.js', 'js/clientStorage.js'], function (template, clientStorage) {


    var blogPostUrl = 'api/posts/list';



    function loadLatestBlogPosts() {
        debugger;
        loadData(blogPostUrl);
    }

    var blogPostUrlId = '/Home/Post/?postId=';

    function loadBlogPost(link) {
        debugger;
        var urlEnviar = blogPostUrl;

        if (link !== '') {
            urlEnviar = blogPostUrlId;
        }

        fetchPromise(urlEnviar, link, true)
            .then(function (status) {
                $('#connection-status').html(status);

                clientStorage.getPostText(link)
                    .then(function (data) {
                        if (!data) {

                            var contentNotFound = $('#blog-content-not-found')
                                .html().replace(/{{Link}}/g, link);
                            template.showBlogItem(contentNotFound, link);
                        } else {
                            var converter = new showdown.Converter();
                            html = converter.makeHtml(data);
                            template.showBlogItem(html, link);
                        }
                        window.location = '#' + link;
                    });
            });
    };


    //function loadBlogPost(link) {
    //    debugger;

    //    var urlEnviar = blogPostUrl;

    //    if (link !== '') {
    //        urlEnviar = blogPostUrlId;
    //    }

    //    fetchPromise(urlEnviar, link, true)
    //        .then(function (status) {
    //            $('#connection-status').html(status);
    //            clientStorage.getPostText(link)
    //                .then(function (data) {
    //                    template.showBlogItem(html, link);
    //                });
    //        });
    //}


    var blogMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';


    function loadMoreBlogPosts() {
        loadData(blogMorePostsUrl + clientStorage.getOldestBlogPostId());
    }


    function fetchPromise(url, link, json) {
        //link = id do post.
        debugger;

        link = link || '';

        var montaLink = ""

        if (url.substring(url.length -1) === '=') {
            montaLink = url + link; 
        } else {
            montaLink = url + '/' + link; 
        }

           debugger;
        return new Promise(function (resolve, reject) {
            
            fetch(montaLink)
                .then(function (data) {
                    var resolveSuccess = function () {
                        resolve('The connection is OK, showing latest results');
                    };

                    if (json) {
                        data.json().then(function (json) {
                            clientStorage.addPostText(link, json).then(resolveSuccess);
                        });
                    }
                    else {
                        data.json().then(function (jsonData) {
                            clientStorage.addPosts(jsonData).then(resolveSuccess);
                        });
                    }
                }).catch(function (e) {
                    resolve('No connection, showing offline results');
                });

            setTimeout(function () {
                resolve('The connection is hanging, showing offline results');
            }, 5000);
        });
    }
    

    function loadData(url) {
        fetchPromise(url)
        .then(function (status) {
            $('#connection-status').html(status);
            clientStorage.getPosts().then(function (posts) {
                template.appendBlogList(posts);
            });
        });
    }

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    };
});