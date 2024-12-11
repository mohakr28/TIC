const auth = require("./authRoute");
const fileRoute = require("./fileRoute");
const userRoute = require("./userRoute");

const route = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/users", userRoute);
  app.use("/api/upload", fileRoute);
};
module.exports = route;
