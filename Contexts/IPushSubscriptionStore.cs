using Lib.Net.Http.WebPush;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Context
{
    public interface IPushSubscriptionStore
    {
        Task<int> StoreSubscriptionAsync(PushSubscription subscription);
    }
}
