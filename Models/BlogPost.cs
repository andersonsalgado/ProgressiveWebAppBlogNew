using ProgressiveWebAppBlog.Extensions;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class BlogPost
{
    [Key]
    public int PostId { get; set; }
    
    [DisplayName("Título")]
    public string Title { get; set; }

    [DisplayName("Mensagem do Post")]
    public string PrevDescription { get; set; }
    
    [DisplayName("Abreviação do Post")]
    public string ShortDescription { get; set; }
    
    [DisplayName("Imagem")]
    public string Image { get; set; }
    [DisplayName("Data")]
    public DateTime Date { get; set; }
    public long CountComent { get; set; }
    public string Link
    {
        get
        {
            return ShortDescription.UrlFriendly(50);
        }
    }
}