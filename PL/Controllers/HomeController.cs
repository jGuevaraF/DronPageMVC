using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PL.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Preguntas()
        {
            ML.Result result = BL.CatPregunta.GetAll();

            ML.CatPregunta catPregunta = new ML.CatPregunta();
            catPregunta.Preguntas = result.Objects;
            return View(catPregunta);
        }

    }
}