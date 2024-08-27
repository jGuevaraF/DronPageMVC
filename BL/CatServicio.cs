using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class CatServicio
    {
        public static ML.Result GetAll()
        {
            ML.Result result = new ML.Result();
            try
            {
                using(DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = context.CatServicioGetAll().ToList();

                    if(query != null)
                    {
                        result.Objects = new List<object>();

                        foreach(var obj in query)
                        {
                            ML.CatServicio catServicio = new ML.CatServicio();
                            catServicio.IdCatServicio = obj.IdCatServicio;
                            catServicio.Titulo = obj.Titulo;
                            catServicio.Contenido = obj.Contenido;

                            result.Objects.Add(catServicio);
                        }

                        result.Correct = true;
                    } else
                    {
                        result.Correct= false;
                        result.ErrorMessage = "No se encontraron registros";
                    }
                }

            }catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }

            return result;
        }
    }
}
