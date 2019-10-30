using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Lib.Net.Http.WebPush;
using Microsoft.EntityFrameworkCore;

namespace ProgressiveWebAppBlog.Repository
{
    public static class ServiceCollectionExtensions
    {

        public static IServiceCollection AddPushSubscriptionStore(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<Context>(options => {
                options.UseSqlite(configuration.GetConnectionString("BlogConnection"));
            });

            services.AddTransient<IPushSubscriptionStore, SqlitePushSubscriptionStore>();
            return services;
        }

        public static IServiceCollection AddPushNotificationService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOptions();
            services.AddMemoryCache();
            services.AddMemoryVapidTokenCache();
            services.AddPushServiceClient(options =>
            {
                IConfigurationSection pushNotificationServiceConfigurationSection = configuration.GetSection(nameof(PushServiceClient));

                options.Subject = pushNotificationServiceConfigurationSection.GetValue<string>(nameof(options.Subject));
                options.PublicKey = pushNotificationServiceConfigurationSection.GetValue<string>(nameof(options.PublicKey));
                options.PrivateKey = pushNotificationServiceConfigurationSection.GetValue<string>(nameof(options.PrivateKey));
            });

            return services;
        }


    }
}
