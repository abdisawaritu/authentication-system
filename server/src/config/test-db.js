const pool = require("./db");

async function testDatabaseConnection() {
  let connection;

  try {
    connection = await pool.getConnection();

    console.log("MySQL connection successful.");

    const [rows] = await connection.query(
      "SELECT DATABASE() AS databaseName, VERSION() AS mysqlVersion",
    );

    console.log("Database:", rows[0].databaseName);
    console.log("MySQL version:", rows[0].mysqlVersion);
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (connection) {
      connection.release();
    }

    await pool.end();
  }
}

testDatabaseConnection();
