using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProgressiveWebAppBlog.Models;
using ProgressiveWebAppBlog.Services;

namespace ProgressiveWebAppBlog.Controllers
{
    public class HomeController : Controller
    {
        private readonly IBlogService _blogService;

        public HomeController(IBlogService blogService)
        {
            _blogService = blogService;
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

    }
}
