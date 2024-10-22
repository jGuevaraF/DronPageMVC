using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Ciudad
    {
        public static ML.Result GetByIdPais(int IdPais)
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = (from ciudad in context.Ciudads
                                 where ciudad.IdPais == IdPais
                                 select new
                                 {
                                     IdCiudad = ciudad.IdCiudad,
                                     Nombre = ciudad.Nombre
                                 }).ToList();

                    if (query.Count > 0)
                    {
                        result.Objects = new List<object>();
                        foreach (var item in query)
                        {
                            ML.Ciudad ciudad = new ML.Ciudad();
                            ciudad.IdCiudad = item.IdCiudad;
                            ciudad.Nombre = item.Nombre;

                            result.Objects.Add(ciudad);
                        }

                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No hay Ciudades";
                    }

                }

            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }

            return result;
        }
    }
}
