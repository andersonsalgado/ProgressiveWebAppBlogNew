using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProgressiveWebAppBlog.Repository
{
    public class Context : DbContext
    {
        public Context( DbContextOptions options) : base(options)
        {

        }

        protected Context()
        {
        }

        public DbSet<BlogPost> BlogPost { get; set; }
    }
}
