
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is missing from server/.env"
  );
}

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  expiration: 24 * 60 * 60 * 1000,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000,
  createDatabaseTable: true,
});

const sessionMiddleware = session({
  name: "auth.sid",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
});

module.exports = {
  sessionMiddleware,
  sessionStore,
};
