using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using BL;

namespace PL.Controllers
{
    public class ReservaController : Controller
    {
        [HttpGet]
        public ActionResult Reserva()
        {
            ML.CatServicio servicio = new ML.CatServicio();
            servicio.Ciudad = new ML.Ciudad();
            servicio.Ciudad.Pais = new ML.Pais();

            ML.Result resultServicio = BL.CatServicio.GetAll();
            if (resultServicio.Correct)
            {
                servicio.CatServicios = resultServicio.Objects;
                ML.Result resultFechaReservada = BL.CatMotivoCorreo.GetAllFechasReservadas();
                // Serializa la lista de FechasReservadas a JSON
                var fechasReservadasJson = JsonConvert.SerializeObject(resultFechaReservada.Objects);

                // Pasar JSON a la vista usando ViewBag
                ViewBag.FechasReservadasJson = fechasReservadasJson;

                //Pais
                ML.Result resultPais = BL.Pais.GetAll();
                servicio.Ciudad.Pais.Paises = resultPais.Objects;

                return View(servicio);
            }
            else
            {

                return View();
            }
        }

        [HttpPost]
        public JsonResult SendEmail(ML.FormularioContacto formularioContacto)
        {
            ML.Result result = BL.FormularioContacto.Add(formularioContacto);

            if (result.Correct)
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

                    //body = usuario.Mensaje;
                    body = formularioContacto.CantidadDrones;


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
                                                                      //Subject = usuario.Asunto,
                        Subject = "Contacto Show de Drones",
                        Body = body,
                        IsBodyHtml = true
                    };

                    //mensaje.To.Add(usuario.EmailUsuario);
                    mensaje.To.Add(formularioContacto.EmailUsuario);
                    smtpClient.Send(mensaje);
                    return Json(new { success = true, mensaje = "Datos recibidos correctamente" }, JsonRequestBehavior.AllowGet);

                }
                catch (Exception ex)
                {
                    return Json(new { success = false, mensaje = ex.Message }, JsonRequestBehavior.AllowGet);
                }
            } else
            {
                return Json(new { success = false, mensaje = result.ErrorMessage }, JsonRequestBehavior.AllowGet);

            }


        }

        [HttpGet]
        public JsonResult GetCiudadByIdPais(int IdPais)
        {
            ML.Result result = BL.Ciudad.GetByIdPais(IdPais);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}