using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class CatServicio
    {
        public int IdCatServicio { get; set; }
        public string Titulo { get; set; }
        public string Contenido { get; set; }
        public ML.FechaReservada FechaReservada { get; set; }
        public List<object> CatServicios { get; set; }

        public ML.Ciudad Ciudad { get; set; }
    }
}
