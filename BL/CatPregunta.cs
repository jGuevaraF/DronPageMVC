using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class CatPregunta
    {
        public static ML.Result GetAll()
        {
            ML.Result result = new ML.Result();
            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = context.CatPreguntaGetAll().ToList();

                    if (query != null)
                    {
                        result.Objects = new List<object>();

                        foreach (var obj in query)
                        {
                            ML.CatPregunta catPregunta = new ML.CatPregunta();
                            catPregunta.IdPregunta = obj.IdPregunta;
                            catPregunta.Pregunta = obj.Pregunta;
                            catPregunta.Respuesta = obj.Respuesta;

                            result.Objects.Add(catPregunta);
                        }

                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se encontraron registros";
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
