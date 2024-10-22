using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class Pais
    {
        public static ML.Result GetAll()
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = (from pais in context.Pais
                                 select new
                                 {
                                     IdPais = pais.IdPais,
                                     Nombre = pais.Nombre
                                 }).ToList();

                    if (query.Count > 0)
                    {
                        result.Objects = new List<object>();
                        foreach (var item in query)
                        {
                            ML.Pais pais = new ML.Pais();
                            pais.IdPais = item.IdPais;
                            pais.Nombre = item.Nombre;
                            result.Objects.Add(pais);
                        }

                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No hay Paises";
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
