using ProgressiveWebAppBlog.Extensions;
using System;
using System.ComponentModel.DataAnnotations;

public class BlogPost
{
    [Key]
    public int PostId { get; set; }
    public string Title { get; set; }
    public string PrevDescription { get; set; }
    public string ShortDescription { get; set; }
    public string Image { get; set; }
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