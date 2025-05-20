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
using System.IO;
using System.Net.Mime;

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
                    string pathCorreoTemplate = Server.MapPath("~/Content/Email/ConfirmacionTemplate.html");
                    //string pathCorreoTemplate = Server.MapPath("~/Content/Email/TestTemplateEmail.html");
                    string body = string.Empty;

                    using (StreamReader reader = new StreamReader(pathCorreoTemplate))
                    {
                        body = reader.ReadToEnd();
                    }

                    string link = Url.Action("Index", "Home", null, Request.Url.Scheme);


                    // Reemplaza los placeholders en el template
                    body = body.Replace("{LINK}", link);
                    body = body.Replace("{Usuario}", formularioContacto.NombreUsuario);
                    body = body.Replace("{CantidadDrones}", formularioContacto.CantidadDrones);
                    body = body.Replace("{Fecha}", formularioContacto.Fecha);
                    //body = body.Replace("{base64}", "cid:colibri"); // Referencia para la imagen incrustada

                    int port = int.Parse(ConfigurationManager.AppSettings["Port"]);
                    bool useDefaultCredentials = bool.Parse(ConfigurationManager.AppSettings["DefaultCredentials"]);
                    string email = ConfigurationManager.AppSettings["Email"];
                    string password = ConfigurationManager.AppSettings["Password"];
                    bool ssl = bool.Parse(ConfigurationManager.AppSettings["EnableSSL"]);

                    var smtpClient = new SmtpClient("smtp.gmail.com")
                    {
                        Port = port,
                        UseDefaultCredentials = useDefaultCredentials,
                        Credentials = new NetworkCredential(email, password),
                        EnableSsl = ssl
                    };

                    var mensaje = new System.Net.Mail.MailMessage
                    {
                        From = new System.Net.Mail.MailAddress(email),
                        Subject = "Contacto Show de Drones",
                        IsBodyHtml = true
                    };

                    // Añade el destinatario
                    mensaje.To.Add(formularioContacto.EmailUsuario);

                    // Crear la vista alterna HTML
                    AlternateView AV = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);

                    // Primera imagen
                    string colibriSolo = Server.MapPath("~/Content/img/Colibri solo 2.png");

                    LinkedResource Img = new LinkedResource(colibriSolo, MediaTypeNames.Image.Jpeg)
                    {
                        ContentId = "colibri", // Identificador único
                        TransferEncoding = TransferEncoding.Base64
                    };

                    // Añadir la imagen a la vista alterna
                    AV.LinkedResources.Add(Img);

                    //Segunda Imagen
                    string colibriRedserva = Server.MapPath("~/Content/img/colibri_reserva.png");

                    LinkedResource Img2 = new LinkedResource(colibriRedserva, MediaTypeNames.Image.Jpeg)
                    {
                        ContentId = "colibri_reserva", // Identificador único
                        TransferEncoding = TransferEncoding.Base64
                    };

                    // Añadir la imagen a la vista alterna
                    AV.LinkedResources.Add(Img2);

                    //Tercera Imagen
                    string iconoDron = Server.MapPath("~/Content/img/Icono Dron.png");

                    LinkedResource Img3 = new LinkedResource(iconoDron, MediaTypeNames.Image.Jpeg)
                    {
                        ContentId = "iconoDron", // Identificador único
                        TransferEncoding = TransferEncoding.Base64
                    };

                    // Añadir la imagen a la vista alterna
                    AV.LinkedResources.Add(Img3);

                    // Agregar la vista alterna al mensaje
                    mensaje.AlternateViews.Add(AV);

                    // Enviar el correo
                    smtpClient.Send(mensaje);

                    return Json(new { success = true, mensaje = "Datos recibidos correctamente" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, mensaje = ex.Message }, JsonRequestBehavior.AllowGet);
                }
            }
            else
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