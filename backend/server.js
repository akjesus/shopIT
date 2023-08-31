const app = require("./app");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

//HANDLE UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`UNCAUGHT EXCEPTION ERROR:  ${err.stack}`);
  console.log("Server shutting down!");
  process.exit(1);
});

//SETUP CONFIG FILE
dotenv.config({ path: "backend/config/config.env" });

//CONNECT DATABASE
const URI =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? process.env.DATABASE_LOCAL
    : process.env.DATABASE_LOCAL;
connectDB(URI);

//SETUP APP TO LISTEN
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//HANDLE UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", (err) => {
  console.log(`UNDANDLED PROMISE REJECTION ERROR:  ${err.message}`);
  console.log("Server shutting down!");
  server.close(() => {
    process.exit(1);
  });
});
