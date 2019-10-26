using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Models
{
    public class PushMessageViewModel
    {
        public string Topic { get; set; }
        public Lib.Net.Http.WebPush.PushMessageUrgency Urgency { get; set; }
        public string Notification { get; set; }
    }
}
