const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgresql",
    database: "softlife",
    port: 5432,
});

// Paso 1
const insertar = async (datos) => {
    const consulta = {
        text: "INSERT INTO usuarios (email, password) values($1, $2) RETURNING *",
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result.rows[0];
    } catch (error) {
        console.log(error.code);
        return error;
    }
};

// Paso 2
const consultar = async (datos) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result.rows;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};

// Paso 3
const login = async (datos) => {
    const consulta = {
        text: `SELECT * FROM usuarios WHERE email = $1 AND password = $2`,
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = { insertar, consultar, login };