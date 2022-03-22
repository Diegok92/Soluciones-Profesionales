const express = require("express");
const app = express();
const cors = require("cors");

const session = require("express-session");

const path = require("path");
const methodOverride = require("method-override");

const mainRoute = require("./routes/main-routers.js");
const profRoute = require("./routes/professionals-routers.js");
const clientRoute = require("./routes/clients-routers.js");
const loginStatusMiddleware = require("./middlewares/loginStatusMiddleware");

app.use(cors())

app.set("view engine", "ejs");

app.use(
  session({
    secret: "Sol. Profesionales para todes",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(methodOverride("_method")); //config la app para q pueda usar "put" y "delete"
app.use("/", mainRoute); // req es la "/" y el res es el main-router, el encargado de redirigir
app.use("/rubros", profRoute);
app.use("/clients", clientRoute);

// app.use((req,res,next)=>{
//   res.status(404).render("not-found")
// })

app.listen(3001, function () {
  console.log("servidor activo");
});

app.use(express.static(path.join(__dirname, "public")));
