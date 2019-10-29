using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Lib.Net.Http.WebPush;
using Microsoft.AspNetCore.Mvc;
using ProgressiveWebAppBlog.Context;
using ProgressiveWebAppBlog.Models;
using ProgressiveWebAppBlog.Services;

namespace ProgressiveWebAppBlog.Controllers
{
    public class HomeController : Controller
    {
        private readonly IBlogService _blogService;
        private readonly PushSubscriptionContext _context;
        private readonly PushServiceClient _pushClient;

        public HomeController(PushSubscriptionContext context, IBlogService blogService)
        {
            _blogService = blogService;
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpGet("publickey")]
        public ContentResult GetPublicKey()
        {
            return Content(_pushClient.DefaultAuthentication.PublicKey, "text/plain");
        }
        //armazena subscricoes
        [HttpPost("subscriptions")]
        public async Task<IActionResult>
        StoreSubscription([FromBody]PushSubscription subscription)
        {
            var _subscriptionStore = new SqlitePushSubscriptionStore(_context);
            int res = await _subscriptionStore.StoreSubscriptionAsync(subscription);
            if (res > 0)
                return CreatedAtAction(nameof(StoreSubscription),
               subscription);
            return NoContent();
        }
        [HttpPost("notifications")]
        public async Task<IActionResult> SendNotification([FromBody]PushMessageViewModel messageVM)
        {
            var _subscriptionStore = new SqlitePushSubscriptionStore(_context);
            var message = new PushMessage(messageVM.Notification)
            {
                Topic = messageVM.Topic,
                Urgency = messageVM.Urgency
            };
            await _subscriptionStore.ForEachSubscriptionAsync((PushSubscription
           subscription) =>
           {
               _pushClient.RequestPushMessageDeliveryAsync(subscription, message);
           });
            return NoContent();
        }
    }
}
