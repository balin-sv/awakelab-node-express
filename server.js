const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
var bodyParser = require("body-parser");

path = require("path");
const cors = require("cors");
const getUsers = require("./getUsers");
const getGastos = require("./getGastos");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

async function getRundomUser() {
  return await axios.get("https://randomuser.me/api/");
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/roommate", (req, res) => {
  getRundomUser().then((data) => {
    const newRoomme = `${data.data.results[0].name.first} ${data.data.results[0].name.last}`;
    const newData = {
      id: uuidv1(),
      name: newRoomme,
    };

    try {
      if (!fs.existsSync("public/roommates.json")) {
        fs.writeFileSync(
          "public/roommates.json",
          JSON.stringify([newData], null, 2),
          "utf8"
        );
      } else {
        fs.readFile("public/roommates.json", (err, data) => {
          if (data.length == 0) {
            fs.writeFileSync(
              "public/roommates.json",
              JSON.stringify([newData], null, 2),
              "utf8"
            );
          } else {
            let json = JSON.parse(data);
            json.push(newData);
            fs.writeFileSync(
              "public/roommates.json",
              JSON.stringify(json, null, 2),
              "utf8"
            );
          }
        });
      }
      console.log("Data successfully saved to disk");
      res.sendStatus(200);
    } catch (err) {
      console.log("An error has occurred ", err);
    }
  });
});

app.post("/gasto", (req, res) => {
  // getRundomUser().then((data) => {
  //   const newRoomme = `${data.data.results[0].name.first} ${data.data.results[0].name.last}`;
  //   const newData = {
  //     id: uuidv1(),
  //     name: newRoomme,
  //   };
  let payload = req.body;

  try {
    if (!fs.existsSync("public/gastos.json")) {
      fs.writeFileSync(
        "public/gastos.json",
        JSON.stringify([payload], null, 2),
        "utf8"
      );
    } else {
      fs.readFile("public/gastos.json", (err, data) => {
        if (data.length == 0) {
          fs.writeFileSync(
            "public/gastos.json",
            JSON.stringify([payload], null, 2),
            "utf8"
          );
        } else {
          let json = JSON.parse(data);
          json.push(payload);
          fs.writeFileSync(
            "public/gastos.json",
            JSON.stringify(json, null, 2),
            "utf8"
          );
        }
      });
    }
    console.log("Data successfully saved to disk");
    res.sendStatus(200);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});
// });

app.get("/roommates", (req, res) => {
  getUsers().then((data) => {
    console.log(data);
    res.json(data);
  });
});

app.get("/gastos", (req, res) => {
  getGastos().then((data) => {
    console.log(data);

    res.json(data);
  });
});

app.listen(3000, () => {
  console.log("en puerto 3000");
});
