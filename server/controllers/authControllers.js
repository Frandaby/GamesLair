import database from "../database.js";

//Para obtener el usuario, a través del email.
export async function getUser(email) {
  const [rows] = await database.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()],
  );
  return rows[0];
}

//Crear user, pidiendo cuatro parámetros.
export async function createUser(firstName, lastName, email, passwordHash) {
  await database.execute(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email.toLowerCase().trim(), passwordHash],
  );
}
