const express = require("express");
const socket = require("socket.io");
const router = express.Router();
const User = require("../models/User");
const cart1 = require("../models/cart1");
const cart2 = require("../models/cart2");
const product = require("../models/products");
const exp = require("../app");
const cors = require("cors");
const bodyParser = require("body-parser");
var Flag = false;
const app = express();

app.use(bodyParser.json());
app.use(cors());

//const User2 = require("../models/Angular");
router.get("/register", (req, res) => res.render("register"));
router.get("/delete", (req, res) => res.render("delete"));
router.get("/update", (req, res) => res.render("update"));
//router.get("/dahboard", (req, res) => res.render("dashboard"));
//handling....!!!
//const server = app.listen(5000, console.log("server started on port 5000"));
router.post("/register", (req, res) => {
  const { name, number, password } = req.body;
  const newUser = new User({
    name,
    number,
    password,
  });
  newUser
    .save()
    .then((user) => {
      //req.flash("success_msg", "you just Registered sucessfully...!!!");
      console.log(newUser);
    })
    .catch((err) => console.log(err));

  res.send("registerd");
});
// router.post("/delete", (req, res) => {
//   const email = req.body.email;
//   //User.find({ email: email }, (err, data) => {
//   //if (err) console.log(err);
//   //console.log(data);
//   //});
//   User.deleteMany({ email: email }, err => {
//     if (err) console.log(err);
//     req.flash("delete_msg", email + " is removed from the Database...!!!");
//     res.redirect("/");
//   });
//   console.log(email);
// });
router.post("/login", (req, res) => {
  const { number, password } = req.body;
  console.log(number, password);
  User.find({ number: number }).exec(function (err, data) {
    console.log(data);
    if (err) {
      return callback(err);
    } else if (!data) {
      console.log("wrong uersname");
      res.send("wrong");
    } else if (data[0].password != password) {
      // req.flash("wrong_msg", "password is incorrect");
      //res.redirect("/users/login");
      console.log("wrong password");
      res.send("wrong");
    } else {
      res.send(data[0]);
      console.log(data[0]);
    }
  });
});
// sub.findOne({ email: email }).exec(function (err, user) {
//   if (err) {
//     return callback(err);
//   } else if (!user) {
//     const newUser = new sub({
//       email,
//     });
//     newUser
//       .save()
//       .then((user) => {
//         console.log(newUser);
//       })
//       .catch((err) => console.log(err));
//   }
//});

router.get("/cartList/:id/:phone", (req, res) => {
  var Data = [];
  Flag = true;
  // User.findOneAndUpdate(
  //   { number: req.params.phone },
  //   { cart: req.params.id },
  //   (err) => {
  //     if (err) console.log(err);
  //   }
  // );
  if (req.params.id == "cart1") {
    console.log("cart1 detected..!");
    cart1.find().exec((err, data) => {
      if (err) {
        return callback(err);
      }
      //console.log(data);
      if (data.length == 0) {
        res.send(Data);
        const io = socket(exp.server);
        io.sockets.on("connection", (socket) => {
          console.log(`new connection id: ${socket.id}`);
          sendData(socket, Data.length);
        });
      }
      for (let i = 0; i < data.length; i++) {
        product.find({ id: data[i].id }).exec(function (err, data1) {
          data1[0].time = data[i].time;
          Data.push(data1[0]);
          if (data.length == Data.length) {
            Data.sort(function (x, y) {
              return x.time - y.time;
            });
            console.log(Data);
            console.log("Data-----------------------------------");
            let count = 0;
            for (let j = 0; j < Data.length; j++) {
              for (let k = 0; k < Data.length; k++) {
                console.log(j, k);
                if (Data[j].name == Data[k].name && Data[k].count != 999) {
                  console.log(j, k, Data[j], Data[k]);
                  count++;
                  if (count > 1) {
                    console.log("enterder--------------");
                    Data[k].count = 999;
                    Data[j].count = count;
                    console.log(Data[j], Data[j]);
                    console.log("------------------------------");
                  }
                }
              }
              count = 0;
            }
            console.log(Data);
            Data = Data.filter(function (obj) {
              return obj.count !== 999;
            });
            Data.sort(function (x, y) {
              return x.time - y.time;
            });
            res.send(Data);
            console.log("---------------------------------------------------");
            console.log(Data);
            const io = socket(exp.server);
            io.sockets.on("connection", (socket) => {
              console.log(`new connection id: ${socket.id}`);
              sendData(socket, data.length);
            });
          }
        });
      }
    });
  }
  if (req.params.id == "cart2") {
    cart2.find().exec((err, data) => {
      if (err) {
        return callback(err);
      }
      if (data.length == 0) {
        res.send("wrong");
      } else {
        res.send(data);
      }
    });
  }
});
function sendData(socket, length) {
  var Data = [];
  Flag = true;
  cart1.find().exec(function (err, data) {
    if (data.length - length > 0 || data.length - length < 0) {
      console.log("enter the dragon");
      if (data.length == 0) {
        socket.emit("data1", Data);
        length = data.length;
        console.log("empty");
      }
      for (let i = 0; i < data.length; i++) {
        product.find({ id: data[i].id }).exec(function (err, data1) {
          data1[0].time = data[i].time;
          Data.push(data1[0]);
          if (data.length == Data.length) {
            // let count = 0;
            // for (let j = 0; j < Data1.length; j++) {
            //   for (let k = 0; k < Data1.length; k++) {
            //     if (Data1[j].name == Data1[k].name && Data1[k].count != 999) {
            //       console.log(Data1[j].name, Data1[k].name);
            //       count++;
            //       if (count > 1) {
            //         Data1[k].count = 999;
            //         Data.splice(k, 1);
            //         Data[j].count = count;
            //       }
            //     }
            //   }
            //   count = 0;
            // }
            // Data = Data.sort(function (x, y) {
            //   return x.time - y.time;
            // });
            // socket.emit("data1", Data);
            // length = data.length;
            //console.log(Data);
            Data.sort(function (x, y) {
              return x.time - y.time;
            });
            console.log(Data);
            console.log("Data-----------------------------------");
            let count = 0;
            for (let j = 0; j < Data.length; j++) {
              for (let k = 0; k < Data.length; k++) {
                console.log(j, k);
                if (Data[j].name == Data[k].name && Data[k].count != 999) {
                  console.log(j, k, Data[j], Data[k]);
                  count++;
                  if (count > 1) {
                    console.log("enterder--------------");
                    Data[k].count = 999;
                    Data[j].count = count;
                  }
                }
              }
              count = 0;
            }
            console.log(Data);
            Data = Data.filter(function (obj) {
              return obj.count !== 999;
            });
            Data.sort(function (x, y) {
              return x.time - y.time;
            });
            socket.emit("data1", Data);
            length = data.length;
            console.log(Data);
          }
        });
      }
    }
    // if (data.length - length < 0) {
    //   console.log("second");
    //   if (data.length == 0) {
    //     socket.emit("data1", Data);
    //     length = data.length;
    //     console.log("empty");
    //   }
    //   for (let i = 0; i < data.length; i++) {
    //     product.find({ id: data[i].id }).exec(function (err, data1) {
    //       Data.push(data1[0]);
    //       if (data.length == Data.length) {
    //         socket.emit("data1", Data);
    //         length = data.length;
    //         console.log(Data);
    //       }
    //     });
    //   }
    // }
  });
  if (Flag) {
    setTimeout(() => {
      sendData(socket, length);
    }, 1000);
  }
}
// router.get("/moreList/:id/:count", (req, res) => {
//   var Data = [];
//   cart1.find().exec(function (err, data) {
//     for (let i = data.length - 1; i > req.params.count - 1; i--) {
//       product.find({ id: data[i].id }).exec(function (err, data1) {
//         Data.push(data1[0]);
//         if (data.length - req.params.count == Data.length) {
//           res.send(Data);
//           console.log(Data);
//         }
//       });
//     }
//   });
// });

router.get("/dashboard", (req, res) => {
  res.send(Data);
  console.log(Data);
});
router.get("/logout/:cart", (req, res) => {
  if (req.params.cart == "cart1") {
    console.log("logout");
    cart1.deleteMany({}, (err) => {
      if (err) console.log(err);
    });
    Flag = false;
  }
});
// router.post("/update", (req, res) => {
//   console.log(req.body.hidden, req.body.parameter, req.body.parameter_replace);
//   if (req.body.hidden == "email") {
//     User.findOneAndUpdate(
//       { name: req.body.parameter },
//       { email: req.body.parameter_replace },
//       err => {
//         if (err) console.log(err);
//         req.flash(
//           "update_msg",
//           req.body.parameter +
//             "'s email is updated to " +
//             req.body.parameter_replace
//         );
//         res.redirect("/");
//       }
//     );
//   }
//   if (req.body.hidden == "name") {
//     User.findOneAndUpdate(
//       { name: req.body.parameter },
//       { name: req.body.parameter_replace },
//       err => {
//         if (err) console.log(err);
//         req.flash(
//           "update_msg",
//           req.body.parameter +
//             "'s name is changed to " +
//             req.body.parameter_replace
//         );
//         res.redirect("/");
//       }
//     );
//   }
// });
module.exports = router;
