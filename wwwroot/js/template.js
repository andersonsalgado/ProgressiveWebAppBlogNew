define([], function () {

    function getImagem(foto) {

        if ($.trim(foto).length > 0) {
            return foto;
        }

        return '/img/Blog/no-image.jpg';

    }

    function generateBlogItem(item) {
        var template = $('#blog-card').html();
        template = template.replace('{{PostId}}', item.postId);
        template = template.replace('{{Title}}', item.title);
        template = template.replace('{{ShortDescription}}', item.shortDescription);
        template = template.replace('{{blog-imagem}}', getImagem(item.image));
        template = template.replace('{{Link}}', item.postId);
        

        //template = template.replace('{{Link}}', item.link);
        return template;
    }
    function appendBlogList(items) {
        var cardHtml = '';
        for (var i = 0; i < items.length; i++) {
            cardHtml += generateBlogItem(items[i]);

        }
        $('.blog-list').append(cardHtml);
    }

    function showBlogItem(data, link) {
        var template = $('#blog-item').html();
        template = template.replace('{{Title}}', data.title || '');
        template = template.replace('{{Image}}', getImagem(data.image) || '');
        template = template.replace('{{Link}}', link);
        template = template.replace('{{Content}}', data.prevDescription || '');
        $('#blog-item-container').html(template);
        $('#blog-item-modal').modal('show');
    }

    return {
        appendBlogList: appendBlogList,
        showBlogItem: showBlogItem
    }
});
