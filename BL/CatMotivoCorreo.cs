using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL
{
    public class CatMotivoCorreo
    {
        public static ML.Result Add(ML.CatMotivoCorreo catMotivoCorreo)
        {
            ML.Result result = new ML.Result();

            try
            {
                using(DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    int filasAfectadas = context.CatMotivoCorreoAdd(catMotivoCorreo.Descripcion);

                    if(filasAfectadas > 0)
                    {
                        result.Correct = true;
                    } else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "Error al insertar en la BD";
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

        public static ML.Result Update(ML.CatMotivoCorreo catMotivoCorreo)
        {
            ML.Result result = new ML.Result();

            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    int filasAfectadas = context.CatMotivoCorreoUpdate(catMotivoCorreo.IdCatMotivoCorreo,catMotivoCorreo.Descripcion);

                    if (filasAfectadas > 0)
                    {
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "Error al actualizar en la BD";
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

        public static ML.Result Delete(int idCatMotivoCorreo)
        {
            ML.Result result = new ML.Result();

            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    int filasAfectadas = context.CatMotivoCorreoDelete(idCatMotivoCorreo);

                    if (filasAfectadas > 0)
                    {
                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "Error al eliminar en la BD";
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

        public static ML.Result GetAll()
        {
            ML.Result result = new ML.Result();

            try
            {
                using (DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = context.CatMotivoCorreoGetAll().ToList();

                    if(query.Count > 0)
                    {
                        result.Objects = new List<object>();

                        foreach(var item in query)
                        {
                            ML.CatMotivoCorreo catMotivoCorreo = new ML.CatMotivoCorreo();
                            catMotivoCorreo.IdCatMotivoCorreo = item.IdMotivoCorreo;
                            catMotivoCorreo.Descripcion = item.Descripcion;

                            result.Objects.Add(catMotivoCorreo);
                        }

                        result.Correct = true;
                    }
                    else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "Error al insertar en la BD";
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

        public static ML.Result GetById(int idCatMotivoCorreo)
        {
            ML.Result result = new ML.Result();
            try
            {
                using(DL.DronPageEntities context = new DL.DronPageEntities())
                {
                    var query = context.CatMotivoCorreoGetById(idCatMotivoCorreo).SingleOrDefault();

                    if(query != null)
                    {
                        ML.CatMotivoCorreo catMotivoCorreo = new ML.CatMotivoCorreo();
                        catMotivoCorreo.IdCatMotivoCorreo = query.IdMotivoCorreo;
                        catMotivoCorreo.Descripcion = query.Descripcion;

                        result.Object = catMotivoCorreo;

                        result.Correct = true;
                    } else
                    {
                        result.Correct = false;
                        result.ErrorMessage = "No se obtuvo ningun registro";
                    }
                }

            } catch(Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
                result.Ex = ex;
            }

            return result;
        }
    }
}
