//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DL
{
    using System;
    using System.Collections.Generic;
    
    public partial class FormularioContacto
    {
        public int IdFormularioContacto { get; set; }
        public string NombreUsuario { get; set; }
        public string EmailUsuario { get; set; }
        public string Telefono { get; set; }
        public string CantidadDrones { get; set; }
        public string Fecha { get; set; }
        public Nullable<int> IdCatServicio { get; set; }
        public Nullable<int> IdCiudad { get; set; }
    
        public virtual CatServicio CatServicio { get; set; }
        public virtual Ciudad Ciudad { get; set; }
    }
}
