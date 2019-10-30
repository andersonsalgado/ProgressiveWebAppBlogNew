using System;

namespace ProgressiveWebAppBlog.Helpers
{
    public static class FormatacaoView
    {
        public static string criarAttr(object valor, int tamanho)
        {
            if (!String.IsNullOrEmpty(Convert.ToString(valor)))
            {
                var str = Convert.ToString(valor);

                if (str.Length > tamanho)
                {
                    var strAbreviado = str.Substring(0, tamanho);
                    return String.Format("<abbr title=\"{0}\">{1}</abbr>", str, strAbreviado);
                }
                else
                {
                    return String.Format("<span>{0}</span>", str);

                }
            }
            else
            {
                return "";
            }

        }
    }
}
