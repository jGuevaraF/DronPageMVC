using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ML
{
    public class FormularioContacto
    {
        public int IdFormularioContacto { get; set; }
        public string NombreUsuario { get; set; }
        public string Ciudad { get; set; }
        public string EmailUsuario { get; set; }
        public string Telefono { get; set; }
        public string CantidadDrones { get; set; }
        public string Fecha { get; set; }
        public ML.CatServicio CatServicio { get; set; }
    }
}
