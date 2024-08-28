using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class CatPregunta
    {
        public byte IdPregunta { get; set; }
        public string Pregunta { get; set; }
        public string Respuesta { get; set; }
        public List<object> Preguntas { get; set; }
    }
}
