using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using ProgressiveWebAppBlog.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Services
{
    public class BlogService : IBlogService
    {
        private IHostingEnvironment _env;
        private readonly Context _context;

        public BlogService(IHostingEnvironment env , Context context)
        {
            _env = env;
            _context = context;
        }

        public async Task<BlogPost> GetPost(long postId)
        {
            return  await _context.BlogPost.FirstOrDefaultAsync(_ => _.PostId == postId);
        }
        public async Task<List<BlogPost>> GetLatestPosts()
        {
            return await _context.BlogPost.OrderByDescending(_ => _.PostId ).Take(2).ToListAsync();
        }

        public async Task<List<BlogPost>> GetOlderPosts(int oldestPostId)
        {
            var posts = await _context.BlogPost.Where(_ => _.PostId < oldestPostId)
                .OrderByDescending(_ => _.PostId).ToListAsync();
            if (posts.Count < 2)
                return posts;
            return posts.Take(2).ToList();
        }
    }
}
