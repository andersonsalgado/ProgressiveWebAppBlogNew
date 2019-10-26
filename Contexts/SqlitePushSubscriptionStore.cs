using Lib.Net.Http.WebPush;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Context
{
    internal class SqlitePushSubscriptionStore : IPushSubscriptionStore
    {
        private readonly PushSubscriptionContext _context;
        public SqlitePushSubscriptionStore(PushSubscriptionContext context)
        {
            _context = context;
        }
        public Task<int> StoreSubscriptionAsync(PushSubscription
        subscription)
        {
            if (_context.Subscriptions.Any(_ => _.Endpoint ==
           subscription.Endpoint))
                return Task.FromResult(0);
            _context.Subscriptions.Add(new
           PushSubscriptionContext.PushSubscription(subscription));
            return _context.SaveChangesAsync();
        }
        public Task ForEachSubscriptionAsync(Action<PushSubscription> action)
        {
            return ForEachSubscriptionAsync(action, CancellationToken.None);
        }
        public Task ForEachSubscriptionAsync(Action<PushSubscription> action, CancellationToken cancellationToken)
        {
            return _context.Subscriptions.AsNoTracking().ForEachAsync(action, cancellationToken);
        }

    }
}
