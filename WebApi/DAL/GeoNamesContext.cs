using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using WebApi.Models;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace WebApi.DAL
{
    public class GeoNamesContext: DbContext
    {
        public GeoNamesContext()
            : base("GeoNamesContext")
        {

        }

        public DbSet<City> Cities { get; set; }

    }

    
}