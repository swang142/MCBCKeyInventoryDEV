import mysql from 'mysql2';

const connectToDB = async () => {
    try {
        const con = await mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            port: process.env.dbport,
            password: process.env.password,
            database: process.env.db
          });
        
          console.log("Database successfully connected")

          return con;
    }
    catch(e) {
        return new Error("Database could not connect")
    }
}

const disconnectFromDB =  async (connection) => {
    try {
        await connection.end(); 
        console.log("Disconnected")
    }
    catch(e) {
        return new Error("Could not Disconnect")
    }
}

export { connectToDB, disconnectFromDB }