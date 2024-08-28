using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace PL.Controllers
{
    public class ReservaController : Controller
    {
        [HttpGet]
        public ActionResult Reserva()
        {
            ML.CatServicio servicio = new ML.CatServicio();
            ML.Result resultServicio = BL.CatServicio.GetAll();
            if (resultServicio.Correct)
            {
                servicio.CatServicios = resultServicio.Objects;
                return View(servicio);
            }
            else
            {

                return View();
            }
        }

        [HttpPost]
        public JsonResult SendEmail(ML.EnviarCorreo usuario)
        {
            try
            {
                //string pathCorreoTemplate = Server.MapPath("~/Content/CorreoTemplate/Correo.html");

                string body = string.Empty;

                //using (StreamReader reader = new StreamReader(pathCorreoTemplate))
                //{
                //    body = reader.ReadToEnd();
                //}

                //body = body.Replace("{nombreCandidato}", "<td></td>");
                //body = body.Replace("{LINK}", "http://www.google.com");

                int port = int.Parse(ConfigurationManager.AppSettings["Port"]);
                bool useDefaultCredentials = bool.Parse(ConfigurationManager.AppSettings["DefaultCredentials"]);
                string email = ConfigurationManager.AppSettings["Email"];
                string password = ConfigurationManager.AppSettings["Password"];
                bool ssl = bool.Parse(ConfigurationManager.AppSettings["EnableSSL"]);

                body = usuario.Mensaje;


                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = port,
                    UseDefaultCredentials = useDefaultCredentials,
                    Credentials = new NetworkCredential(email, password),
                    EnableSsl = ssl
                };

                var mensaje = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress(email),//
                    Subject = usuario.Asunto,
                    Body = body,
                    IsBodyHtml = true
                };

                mensaje.To.Add(usuario.EmailUsuario);
                smtpClient.Send(mensaje);
                return Json(new { success = true, mensaje = "Datos recibidos correctamente" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { success = false, mensaje = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}