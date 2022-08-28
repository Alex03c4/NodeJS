const fs = require("fs"); //imagen
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};

const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).json([
    {
      curso: "Master en Ract",
      autor: "naudis Garcia",
      url: "Naudis.com",
    },
    {
      curso: "jAVA",
      autor: "naudis Garcia",
      url: "Naudis.com",
    },
  ]);
};

const crear = (req, res) => {
  // Recoger parametros por post a guardar
  let parametros = req.body;

  // validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  // Crear el objeto a guardar
  const articulo = new Articulo(parametros);

  // Asignar valores a objeto basado en el modelo (Manual o Automatico)
  //articulo.titulo = parametros.titulo;

  // Guardar el articulo en la base de datos
  articulo.save((error, articuloGuardado) => {
    if (error || !articuloGuardado) {
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo",
      });
    }
    // Devolver resultados
    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Articulo creado con exito!!",
    });
  });
};

const listar = (req, res) => {
  let consulta = Articulo.find({});

  if (req.params.ultimos) {
    consulta.limit(3);
  }

  consulta
    .sort({ fecha: -1 }) //Para ordenar
    .exec((error, articulos) => {
      if (error || !articulos) {
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado articulos",
        });
      }

      return res.status(200).send({
        status: "success",
        parametro: req.params.ultimos,
        contador: articulos.length,
        articulos,
      });
    });
};

const uno = (req, res) => {
  // Recoder un id por la url
  let id = req.params.id;
  // Buscar el articulo
  Articulo.findById(id, (error, articulo) => {
    if (error || !articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado el articulo",
      });
    }
    // devolver resultado
    return res.status(200).json({
      status: "success",
      articulo,
    });
  });
};

const borrar = (req, res) => {
  let articuloId = req.params.id;

  Articulo.findByIdAndDelete({ _id: articuloId }, (error, articuloBorrado) => {
    if (error || !articuloBorrado) {
      return res.status(500).json({
        status: "error",
        mensaje: "Error al borrar el articulo",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Metodo de borrar",
    });
  });
};

const editar = (req, res) => {
  // Recorger id articulo a editar
  let ArticuloId = req.params.id;

  // Recoger datos de body
  let parametros = req.body;

  // validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar",
    });
  }

  // Buscar y actualizar articulo
  Articulo.findOneAndUpdate(
    { _id: ArticuloId },
    req.body,
    { new: true },
    (error, articuloActualizado) => {
      if (error || !articuloActualizado) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar",
        });
      }

      return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
      });
    }
  );
};

const subir = (req, res) => {
  // Recorger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalida",
    });
  }

  // Nombre del archivo
  let archivo = req.file.originalname;

  // Extension del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida",
      });
    });
  } else {
    // Recorger id articulo a editar
    let ArticuloId = req.params.id;

    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate(
      { _id: ArticuloId },
      { imagen: req.file.filename },
      { new: true },
      (error, articuloActualizado) => {
        if (error || !articuloActualizado) {
          return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar",
          });
        }

        return res.status(200).json({
          status: "success",
          articulo: articuloActualizado,
          fichero: req.file,
        });
      }
    );
  }
};

const imagen = (req, res) => {
  let fichero = req.params.fichero;
  let ruta_fisica = "./imagenes/articulos/" + fichero;
  fs.stat(ruta_fisica, (error, existe) => {
    if (existe) {
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        existe,
        fichero,
        ruta_fisica,
      });
    }
  });
};

const buscador = (req, res) => {
  //sacar el string de busqueda
  let busqueda = req.params.busqueda;

  // find OR
  Articulo.find({"$or": [
      { "titulo": { "$regex": busqueda, "$options": "i" } },
      { "contenido": { "$regex": busqueda, "$options": "1" } },
    ],
  })
  .sort({ fecha: -1 })
  .exec((error, articulosEncontrados) => {

    if (error || !articulosEncontrados || articulosEncontrados.length <=0 ) {
        return res.status(404).json({ 
          status: "error",
          mensaje: "No se han encontrado articulos"
        });
    }

    return res.status(200).json({
      status: "success",  
      articulos: articulosEncontrados
    });
  });
};

module.exports = {
  prueba,
  curso,
  crear,
  listar,
  uno,
  borrar,
  editar,
  subir,
  imagen,
  buscador,
};