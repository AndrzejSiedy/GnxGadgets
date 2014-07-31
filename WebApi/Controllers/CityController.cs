using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApi.Models;
using WebApi.DAL;
using System.Web.Http.Cors;

namespace WebApi.Controllers
{

    //[EnableCors("*", "*", "GET,POST")]
    public class CityController : ApiController
    {
        private GeoNamesContext db = new GeoNamesContext();

        // GET api/City
        //[Route("api/City/GetCitiesPaging/{_dc?}/{page?}/{limit?}/{start?}")]
        public IQueryable<City> GetCities()
        {
            var requestParams = Request.GetQueryNameValuePairs();
            return db.Cities;
        }


        //NOTE: adding "?" allows for using standard requests
        // api/city/GetCitiesPaging?start=10&limit=20
        // important to add 
        [HttpGet]
        [Route("api/City/GetCitiesPaging/{_dc?}/{page?}/{limit?}/{start?}")]
        public StoreData GetCitiesPaging(int _dc = 0, int page = 1, int limit = 50, int start = 0)
        {

            var list = db.Cities.ToList().OrderBy(m => m.AsciiName);

            return new StoreData()
            {
                limit = limit,
                start = start,
                total = list.Count(),
                records = list.Skip(start).Take(limit).ToList()
            }; ;
        }

        // POST api/<controller>
        [HttpPost]
        //public IHttpActionResult PostTest([FromBody]string value)
        public string PostTest(string value)
        {
            string test = "DUPA";
            //return Ok();
            return test;
        }


        // GET api/<controller>
        //NOTE: to make sure data can be serialised as JSON
        // var json = config.Formatters.JsonFormatter;
        // json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
        // config.Formatters.Add(json);
        // config.Formatters.Remove(config.Formatters.XmlFormatter);
        // was added to the WebApiConfig.cs
        //public IEnumerable<City> Get(int start = 0, int limit = 20)
        //{
        //    return db.Cities.ToList().Skip(start).Take(limit);
        //}

        // GET api/City/5
        [ResponseType(typeof(City))]
        public IHttpActionResult GetCity(int id)
        {
            City city = db.Cities.Find(id);
            if (city == null)
            {
                return NotFound();
            }

            return Ok(city);
        }

        // PUT api/City/5
        public IHttpActionResult PutCity(int id, City city)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != city.ID)
            {
                return BadRequest();
            }

            db.Entry(city).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CityExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/City
        [ResponseType(typeof(City))]
        public IHttpActionResult PostCity(City city)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Cities.Add(city);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = city.ID }, city);
        }

        // DELETE api/City/5
        [ResponseType(typeof(City))]
        public IHttpActionResult DeleteCity(int id)
        {
            City city = db.Cities.Find(id);
            if (city == null)
            {
                return NotFound();
            }

            db.Cities.Remove(city);
            db.SaveChanges();

            return Ok(city);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CityExists(int id)
        {
            return db.Cities.Count(e => e.ID == id) > 0;
        }
    }
}