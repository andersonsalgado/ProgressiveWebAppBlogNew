define(['./template.js', '../lib/showdown/showdown.js'],
    function (template, showdown) {
        var blogPostUrl = 'api/posts/list';
        //var blogPostUrl = '/Home/Post/?link=';
        function loadLatestBlogPosts() {
            fetch(blogPostUrl)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    appendBlogList(data);
                });
        }
        return {
            loadLatestBlogPosts:
                loadLatestBlogPosts
        }
    });

function fetchPromise(url, link, text) {
    link = link || '';
    return new Promise(function (resolve, reject) {
        fetch(url + link)
            .then(function (data) {
                var resolveSuccess = function () {
                    resolve('The connection is OK, showing latest results');
                };
                if (text) {
                    data.text().then(function (text) {
                        clientStorage.addPostText(link,
                            text).then(resolveSuccess);
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
            clientStorage.getPosts()
                .then(function (posts) {
                    template.appendBlogList(posts);
                })
        });
}
function loadMoreBlogPosts() {
    loadData(blogMorePostsUrl +
        clientStorage.getOldestBlogPostId());
}

function loadBlogPost(link) {
    fetchPromise(blogPostUrl, link, true)
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
                })
        });
}

function loadLatestBlogPosts() {
    loadData(blogLatestPostsUrl);
}
function loadMoreBlogPosts() {
    loadData(blogMorePostsUrl + oldestBlogPostId);
}