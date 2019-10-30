using ProgressiveWebAppBlog.Extensions;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class BlogPost
{
    [Key]
    public int PostId { get; set; }
    
    [DisplayName("Título")]
    [MaxLength(50,ErrorMessage = "Informe até 50 caracteres.")]
    public string Title { get; set; }

    [DisplayName("Post")]
    public string PrevDescription { get; set; }
    
    [DisplayName("Abreviação")]
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