const http = require("http");
const fs = require('fs');
const url = require('url');
const { insertar, consultar, login } = require('./consultas');
const port = 3000;

// Servidor
http
    .createServer(async (req, res) => {
        // Ruta raiz
        if (req.url == "/" && req.method == "GET") {
            res.setHeader('content-type', 'text/html;charset=utf8')
            const html = fs.readFileSync('index.html', 'utf8')
            res.statusCode = 200;
            res.end(html);

        // Paso 1: Disponibilizar una ruta POST /usuario que utilice una función asíncrona para emitir
        // una consulta SQL y almacenar un nuevo usuario en la tabla usuarios.
        } else if ((req.url == "/usuario" && req.method == "POST")) {
            try {
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk;
                });
                req.on("end", async () => {
                    const usuario = (JSON.parse(body));
                    console.log(usuario)
                    const result = await insertar(usuario);
                    res.statusCode = 201;
                    res.end(JSON.stringify(result));
                });
            } catch (error) {
                showError(error, res);
            }

        // Paso 3: Disponibilizar una ruta GET /usuarios que utilice una función asíncrona para emitir
        // una consulta SQL y devolver todos los usuarios de la tabla usuarios'
        } else if (req.url == "/usuarios" && req.method == "GET") {
            try {
                const registros = await consultar();
                res.statusCode = 200;
                res.end(JSON.stringify(registros));
            } catch (error) {
                showError(error, res);
            }
        }

        // Paso 2: Disponibilizar una ruta POST /login que utilice una función asíncrona para emitir una
        // consulta SQL, valide el correo y contraseña recibido en la consulta.
        else if (req.url == '/login' && req.method == "POST") {
            try {
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk;
                });

                req.on("end", async () => {
                    const datos = Object.values(JSON.parse(body));
                    const respuesta = await login(datos);

                    if (respuesta.rows[0].count != 0) {
                        res.end()
                    }
                    else {
                        res.statusCode = 404;
                        res.statusMessage = 'Not found';
                        res.end('Usuario no encontrado.')
                    }
                });

            } catch (error) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                res.end('Usuario no encontrado.')
            };

        } else {
            res.statusCode = 404;
            const respuesta = 'Recurso no encontrado.';
            console.log(respuesta);
            res.end(respuesta);
        };
    })

    .listen(port, () => console.log('Conectado al puerto:', port));

const showError = (error, res) => {
    console.log(error.message);
    console.log(error.code);
    res.statusCode = 500;
    res.end(JSON.stringify(error));
};