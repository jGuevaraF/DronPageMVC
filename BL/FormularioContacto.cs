using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class FormularioContacto
    {
        public static ML.Result Add(ML.FormularioContacto contacto)
        {
            ML.Result result = new ML.Result();
            try
            {
                using(DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    int filasAfectadas = context.FormularioContactoAdd(contacto.NombreUsuario, contacto.EmailUsuario, contacto.Telefono, contacto.CantidadDrones, contacto.Fecha, contacto.CatServicio.IdCatServicio, contacto.CatServicio.Ciudad.IdCiudad);

                    if (filasAfectadas > 0)
                    {
                        result.Correct = true;
                    } else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se pudo insertar";
                    }
                }

            } catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }

            return result;
        }
    }
}
