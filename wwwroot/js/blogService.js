define(['js/template.js'], function (template) {
    var blogPostUrl = 'api/posts/list';

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