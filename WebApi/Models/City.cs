using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.Models
{
    public class City
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string AsciiName { get; set; }
        public float Lat { get; set; }
        public float Lon { get; set; }
        public string CountryCode { get; set; }
        public float Population { get; set; }
        public string Timezone { get; set; }

    }
}