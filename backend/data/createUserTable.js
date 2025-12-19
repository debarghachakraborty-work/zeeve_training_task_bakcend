import pool from '../config/db.js';

const createUserTable = async() => {
        const queryText = `
                create table if not exists users(
                    id serial primary key,
                    name varchar(100) not null,
                    email varchar(100) unique not null,
                    password varchar(100) not null,
                    created_at timestamp default NOW()
            )
        `
        try {
              await  pool.query(queryText);
                console.log("User table created successfully");
        }catch(err){
                console.error("Error creating user table", err);
        }
}

export default createUserTable;