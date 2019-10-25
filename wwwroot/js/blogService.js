define(['js/template.js'], function (template) {

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
        fetch(blogMorePostsUrl + oldestBlogPostId)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
                template.appendBlogList(data);
                setOldestBlogPostId(data);
            });
    }



    return {
        loadLatestBlogPosts: loadLatestBlogPosts,
        loadBlogPost: loadBlogPost,
        loadMoreBlogPosts: loadMoreBlogPosts
    };
});