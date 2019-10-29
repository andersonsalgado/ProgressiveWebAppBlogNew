using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Repository
{
    public class BlogContext : DbContext
    {
        public BlogContext( DbContextOptions options) : base(options)
        {

        }

        protected BlogContext()
        {
        }

        public DbSet<BlogPost> BlogPost { get; set; }
    }
}
