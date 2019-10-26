define(['js/template.js,js/clientStorage.js'], function (template, clientStorage) {

    var oldestBlogPostId = 0;

    

    function setOldestBlogPostId(data) {
        var ids = data.map(item => item.postId);
        oldestBlogPostId = Math.min(...ids);
    }

    var blogPostUrl = 'api/posts/list';
    


    function loadLatestBlogPosts() {
        fetch(blogPostUrl)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                template.appendBlogList(data);
                setOldestBlogPostId(data);
            });
    }

    var blogPostUrlId = '/Home/Post/?postId=';

    function loadBlogPost(link) {

        fetch(blogPostUrlId + link)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                template.showBlogItem(data, link);
                window.location = '#' + link;
            });
    }


    var blogMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';
    
    
    function loadMoreBlogPosts() {
        //fetch(blogMorePostsUrl + oldestBlogPostId)
        //    .then(function (response) {
        //        return response.json();
        //    }).then(function (data) {
        //        console.log(data);
        //        template.appendBlogList(data);
        //        setOldestBlogPostId(data);
        //    });

        loadData(blogMorePostsUrl + clientStorage.getOldestBlogPostId());

    }

    function fetchPromise(url) {
        return new Promise(function (resolve, reject) {
            fetch(url)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                clientStorage.addPosts(data);
            }).then(function () {
                resolve('The connection is OK, showing latest results');
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
            clientStorage.getPosts();
        })
        .then(function (post) {
            template.appendBlogList(posts);
        });
    } 

    
    

    

    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    };
});