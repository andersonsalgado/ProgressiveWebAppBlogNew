using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Services
{
    public interface IBlogService
    {
        Task<BlogPost> GetPost(long postId);
        Task<List<BlogPost>> GetLatestPosts();
        Task<List<BlogPost>> GetOlderPosts(int oldestPostId);

    }
}