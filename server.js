require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
connectDB();
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:3000/"],
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.static("static"));
app.use(express.static("/"));
app.use(express.json());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.options("*", cors());

// Routes
app.get("/", (req, res) => {
  res.render("./static/index.html");
});
try {
  app.use("/api/files", require("./routes/files"));
} catch (error) {
  console.log("Error Tracked Just");
}
// app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
