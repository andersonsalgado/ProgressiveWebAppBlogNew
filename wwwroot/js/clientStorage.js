define([], function () {

    var oldestBlogPostId = "";

    var blogInstance = localforage.createInstance({ name: 'blog' });

    

    function addPosts(posts) {
        return new Promise(function (resolve, reject) {

            var keyValuePair = [];
            posts.map(function (item) {
                keyValuePair.push({ key: item.postId, value: item });
            });

            blogInstance.setItems(keyValuePair).then(function () {
                resolve();
            }); 
        });
    }

    
    var limit = 2;
    function getPosts() {
        return new Promise(function (resolve, reject) {
            blogInstance.keys().then(function (_keys) {
                
                _keys = _keys.filter(function (a) {
                    return a && !a.toString().includes('#')
                });

                _keys = _keys.sort(function (a, b) {
                    return a - b
                });

                var index = _keys.indexOf(oldestBlogPostId);
                if (index === -1) { index = _keys.length; }
                if (index === 0) { resolve([]); return; }
                var start = index - limit;
                var limitAdjusted = start < 0 ? index : limit;
                var keys = _keys.splice(Math.max(0, start), limitAdjusted);
                blogInstance.getItems(keys).then(function (results) {
                    var posts = Object.keys(results).map(function (k) {
                        return results[k];
                    }).reverse();
                    oldestBlogPostId = posts[posts.length - 1].postId;
                    resolve(posts);
                });
            });
        });
    }

    function addPostText(link, json) {
        
        return new Promise(function (resolve, reject) {
            blogInstance.setItem('#' + link,json).then(function () {
                resolve();
            });
        });
    }

    function getPostText(json) {
        return new Promise(function (resolve, reject) {
            blogInstance.getItem('#' + json)
                .then(function (json) {
                    resolve(json);
                });
        });
    }



    function getOldestBlogPostId() {
        return oldestBlogPostId;
    }

    return {
        addPosts: addPosts,
        getPosts: getPosts,
        getOldestBlogPostId: getOldestBlogPostId,
        getPostText: getPostText,
        addPostText: addPostText
    };

});