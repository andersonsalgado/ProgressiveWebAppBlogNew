using Lib.Net.Http.WebPush;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebPush = Lib.Net.Http.WebPush;

namespace ProgressiveWebAppBlog.Repository
{
    public class Context : DbContext
    {

        public class PushSubscription : WebPush.PushSubscription
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

            public PushSubscription(WebPush.PushSubscription subscription)
            {
                Endpoint = subscription.Endpoint;
                Keys = subscription.Keys;
            }
        }

        public Context( DbContextOptions options) : base(options)
        {

        }

        protected Context()
        {
        }

        public DbSet<BlogPost> BlogPost { get; set; }
        public DbSet<PushSubscription> Subscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            EntityTypeBuilder<PushSubscription> pushSubscriptionEntityTypeBuilder = modelBuilder.Entity<PushSubscription>();
            pushSubscriptionEntityTypeBuilder.HasKey(e => e.Endpoint);
            pushSubscriptionEntityTypeBuilder.Ignore(p => p.Keys);
        }

    }
}
