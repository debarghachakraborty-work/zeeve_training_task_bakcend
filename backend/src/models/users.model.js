import pool from '../../config/db.js'


export async function createUser({name, email, password}) {
    const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id,name,email;
    `
    const values = [name, email, password];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

export async function getUserByEmail(email) {
    const {rows} =  await pool.query(`
        SELECT * FROM users where email = $1
    `, [email]);//why do we write it this way?
    
    return rows[0];

}

export async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
}


