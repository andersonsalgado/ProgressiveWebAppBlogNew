using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Lib.Net.Http.WebPush;
using Microsoft.AspNetCore.Mvc;
using ProgressiveWebAppBlog.Models;
using ProgressiveWebAppBlog.Repository;
using ProgressiveWebAppBlog.Services;

namespace ProgressiveWebAppBlog.Controllers
{
    public class HomeController : Controller
    {
        private readonly IBlogService _blogService;
        private readonly IPushSubscriptionStore _subscriptionStore;
        private readonly PushServiceClient _pushClient;

        public HomeController(IBlogService blogService, IPushSubscriptionStore subscriptionStore, PushServiceClient pushClient)
        {
            _blogService = blogService;
            _subscriptionStore = subscriptionStore;
            _pushClient = pushClient;
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

        public async Task<JsonResult> LatestBlogPosts()
        {
            var posts = await _blogService.GetLatestPosts();
            return Json(posts);
        }
        public async Task<JsonResult> Post(long postId)
        {
            return  Json(await _blogService.GetPost(postId));
        }

        public async Task<JsonResult> MoreBlogPosts(int oldestBlogPostId)
        {
            var posts = await _blogService.GetOlderPosts(oldestBlogPostId);
            return Json(posts);
        }

        [HttpGet("publickey")]
        public ContentResult GetPublicKey()
        {
            return Content(_pushClient.DefaultAuthentication.PublicKey, "text/plain");
        }

        //armazena subscricoes
        [HttpPost("subscriptions")]
        public async Task<IActionResult> StoreSubscription([FromBody]PushSubscription subscription)
        {
            int res = await _subscriptionStore.StoreSubscriptionAsync(subscription);

            if (res > 0)
                return CreatedAtAction(nameof(StoreSubscription), subscription);

            return NoContent();
        }

        [HttpDelete("subscriptions")]
        public async Task<IActionResult> DiscardSubscription(string endpoint)
        {
            await _subscriptionStore.DiscardSubscriptionAsync(endpoint);

            return NoContent();
        }

        [HttpPost("notifications")]
        public async Task<IActionResult> SendNotification([FromBody]PushMessageViewModel messageVM)
        {
            var message = new PushMessage(messageVM.Notification)
            {
                Topic = messageVM.Topic,
                Urgency = messageVM.Urgency
            };

            await _subscriptionStore.ForEachSubscriptionAsync((PushSubscription subscription) =>
            {
                _pushClient.RequestPushMessageDeliveryAsync(subscription, message);
            });

            return NoContent();
        }
    }

}

