function appendBlogList(data) {
    debugger;

    var itemColPostClone = $("#itemColPost").clone();
    $("#itemColPost").remove();


    var itemRowPost = $("#itemRowPost").clone();
    $("#itemRowPost").remove();

    


    var $bloglist = $("#blog-list");
    var $itemRowPost = $("#itemRowPost");
    

    for (var i = 0; i < data.length; i++) {
        if (i % 0 ) {
            var newRow = itemRowPost.clone();



            $bloglist.append(newRow);
        }
    }

    


}