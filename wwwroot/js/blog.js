function fetchPromise(url) {
    return new Promise(function (resolve, reject) {
        fetch(url)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                clientStorage.addPosts(data)
                    .then(function () {
                        resolve('The connection is OK, showing latest results');
                    });
            }).catch(function (e) {
                resolve('No connection, showing offline results');
            });
        setTimeout(function () {
            resolve('The connection is hanging, showing offline results');
        }, 1000);
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