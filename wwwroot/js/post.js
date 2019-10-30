(function ($) {
    $(document).ready(function () {
        $("#ImagemUpload").bind('change', function (a, b, c, d) {
            toBase64(this, function (file, base64) {
                arquivoConvertido = base64;
                $("#fotoTemp").attr("src", base64);
                $("#fotoTemp").css('display', 'block');
                $("#Image").val(base64);
            });
        });

        var toBase64 = function (file, callBack) {
            file = file.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                callBack(file, reader.result);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        };
    });
})(jQuery);

