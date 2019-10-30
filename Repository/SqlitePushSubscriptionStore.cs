using Lib.Net.Http.WebPush;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Repository
{

    internal class SqlitePushSubscriptionStore : IPushSubscriptionStore
    {
        private readonly Context _context;

        public SqlitePushSubscriptionStore(Context context)
        {
            _context = context;
        }

        public Task<int> StoreSubscriptionAsync(PushSubscription subscription)
        {
            if (_context.Subscriptions.Any(_ => _.Endpoint == subscription.Endpoint))
                return Task.FromResult(0);

            _context.Subscriptions.Add(new Context.PushSubscription(subscription));

            return _context.SaveChangesAsync();
        }

        public Task<bool> CheckSubscriptionAsync(string endpoint)
        {
            return Task.FromResult(_context.Subscriptions.Any(_ => _.Endpoint == endpoint));
        }

        public async Task DiscardSubscriptionAsync(string endpoint)
        {
            Context.PushSubscription subscription = await _context.Subscriptions.FindAsync(endpoint);

            _context.Subscriptions.Remove(subscription);

            await _context.SaveChangesAsync();
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
