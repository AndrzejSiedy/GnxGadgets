using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class StoreData
    {
        public int total { get; set; }
        public int start { get; set; }
        public int limit { get; set; }
        public List<City> records { get; set; }
    }
}