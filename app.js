const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const roleRoutes = require("./routes/role.routes");
const userRoutes = require("./routes/user.routes");
const userAuthentication = require("./routes/user.authentication");
const auth = require("./middlewares/auth");

const app = express();
const port = 8080;

mongoose
  .connect("mongodb://127.0.0.1:27017/local", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");

    app.use(bodyParser.json());
    app.use("/api/roles", roleRoutes);
    app.use("/api/users", auth, userRoutes);
    app.use("/api/auth", userAuthentication);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
