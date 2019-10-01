define([], function () {
    var blogInstance = localforage.createInstance({
        name: 'blog'
    });
    function addPosts(posts) {
        return new Promise(function (resolve, reject) {
            var keyValuePair = [];
            posts.map(function (item) {
                keyValuePair.push({
                    key: item.postId,
                    value: item
                });
            })
            blogInstance.setItems(keyValuePair)
                .then(function () {
                    resolve();
                });
        });
    }
    return {
        addPosts: addPosts
    }
});

var oldestBlogPostId = null;
var limit = 3;
function getPosts() {
    return new Promise(function (resolve, reject) {
        blogInstance.keys().then(function (keys) {
            var index = keys.indexOf(oldestBlogPostId);
            if (index == -1) { index = keys.length; }
            if (index == 0) { resolve([]); return; }
            var start = index - limit;
            var limitAdjusted = start < 0 ? index : limit;
            var keys = keys.splice(Math.max(0, start),
                limitAdjusted);
            blogInstance.getItems(keys).then(function
                (results) {
                var posts =
                    Object.keys(results).map(function (k) {
                        return results[k]
                    }).reverse();
                oldestBlogPostId = posts[posts.length -
                    1].postId;
                resolve(posts);
            });
        });
    });
}
function getOldestBlogPostId() {
    return oldestBlogPostId;
}

function getPostText(link) {
    return new Promise(function (resolve, reject) {
        blogInstance.getItem('#' + link)
            .then(function (text) {
                resolve(text);
            });
    });
}
function addPostText(link, text) {
    return new Promise(function (resolve, reject) {
        blogInstance.setItem('#' + link,
            text).then(function () {
                resolve();
            });
    });
}
return {
    addPosts: addPosts,
    getPosts: getPosts,
    getOldestBlogPostId: getOldestBlogPostId,
    addPostText: addPostText,
    getPostText: getPostText
}