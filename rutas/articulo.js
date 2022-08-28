const express = require("express");
const multer = require("multer"); // IMG
const ArticuloController = require("../comtroladores/articulo");

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagenes/articulos/');
    },
    filename: function(req, file, cb){
        cb(null, "articulo"+ Date.now() + file.originalname)
    }
});

const subidas = multer({storage: almacenamiento});


// Ruta de prueba 
router.get("/ruta-de-prueba", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);

// Ruta util    
router.post("/crear", ArticuloController.crear);
router.get("/articulos/:ultimos?", ArticuloController.listar);
router.get("/articulo/:id", ArticuloController.uno);
router.delete("/articulo/:id", ArticuloController.borrar);
router.put("/articulo/:id", ArticuloController.editar);
router.post("/subir-imagen/:id",[subidas.single("file0")], ArticuloController.subir);
router.get("/imagen/:fichero", ArticuloController.imagen);
router.get("/buscar/:busqueda", ArticuloController.buscador);


module.exports = router;