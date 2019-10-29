using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lib.Net.Http.WebPush;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ProgressiveWebAppBlog.Context
{
    public class PushSubscriptionContext : DbContext
    {
        public class PushSubscription : Lib.Net.Http.WebPush.PushSubscription
        {
            public string P256DH
            {
                get { return GetKey(PushEncryptionKeyName.P256DH); }
                set { SetKey(PushEncryptionKeyName.P256DH, value); }
            }
            public string Auth
            {
                get { return GetKey(PushEncryptionKeyName.Auth); }
                set { SetKey(PushEncryptionKeyName.Auth, value); }
            }
            public PushSubscription()
            { }
            public PushSubscription(Lib.Net.Http.WebPush.PushSubscription subscription)
            {
                Endpoint = subscription.Endpoint;
                Keys = subscription.Keys;
            }
        }
        public DbSet<PushSubscription> Subscriptions { get; set; }
        public
        PushSubscriptionContext(DbContextOptions<PushSubscriptionContext>
        options)
         : base(options)
        { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            EntityTypeBuilder<PushSubscription>
    pushSubscriptionEntityTypeBuilder =
    modelBuilder.Entity<PushSubscription>();
            pushSubscriptionEntityTypeBuilder.HasKey(e => e.Endpoint);
            pushSubscriptionEntityTypeBuilder.Ignore(p => p.Keys);
        }
    }
}
