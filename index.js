const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");
// Inicializar App
console.log("App de node Arrancada");
// Conectar a la base de datos
conexion();
// Crear servidor de Node
const app = express();
const puerto = 3900;
// Configurar cors
app.use(cors());
// Convertir body a objeto JS
app.use(express.json()); // recibir dato con content-type app/json
app.use(express.urlencoded({extended:true}));  // form-urlencoded
// Rutas 
const rutas_articulo = require("./rutas/articulo");
//cargo las rutas
app.use("/api", rutas_articulo);

// Rutas Pruebas Hardcodeadas
app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).json(
        [
            {
                curso: "Master en Ract",
                autor: "naudis Garcia",
                url: "Naudis.com"
            },
            {
                curso: "jAVA",
                autor: "naudis Garcia",
                url: "Naudis.com"
            },
        ]
    );
});

app.get("/", (req, res) => {  
    return res.status(200).send(
        `<h1>Empezando a crea un api rect con node</h1>`
    );
});



// Crear servidor y escuchar peticiones http
app.listen(puerto, ()=> {
    console.log("Servidor Coriiendo en el puerto " + puerto);
});