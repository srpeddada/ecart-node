//import { createfrom } from 'module';
import express  from "express";
import expressLayouts  from "express-ejs-layouts";
import cors  from "cors";
import mongoose  from "mongoose";
const app = express();
import bodyParser  from "body-parser";
import flash  from "connect-flash";
import session from "express-session";
//import root from ""
import path from './routes/index.js';
import path2 from './routes/users.js';
//from "env").config();
app.use(bodyParser.json());
var port = process.env.PORT || 443;
//const MongoClient = from "mongodb").MongoClient;
//const uri =
//"mongodb+srv://srpeddada:MU4kLzKrcxjSfeSp@login-gsmjq.mongodb.net/test?retryWrites=true&w=majority";
//const client = new MongoClient(uri, {
//useNewUrlParser: true,
//useUnifiedTopology: true
//});
//client.connect(err => {
//const collection = client.db("test").collection("devices");
// perform actions on the collection object
//client.close();
//});

//DB config
//const db = from "./config/keys.js").MongoURI;
//console.log(db);
app.use(cors());
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
  "mongodb+srv://srpeddada:Srinivas2@cluster0-tbypt.gcp.mongodb.net/ecart?retryWrites=true&w=majority"
);
const connection = mongoose.connection;
connection.on("connected", () => {
  console.log("connected to db");
});
//EJS are below
app.use(expressLayouts);
app.set("view engine", "ejs");
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.delete_msg = req.flash("delete_msg");
  res.locals.update_msg = req.flash("update_msg");
  res.locals.wrong_msg = req.flash("wrong_msg");
  next();
});
//routes are below
app.use("/", path);
app.use("/users", path2);
const server = app.listen(port, () =>
  console.log("server started on port 5000")
);

export default server;
