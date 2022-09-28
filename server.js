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
    origin: "http://localhost:3000/",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

async function getRundomUser() {
  return await axios.get("https://randomuser.me/api/");
}

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
  console.log(req.body);
  let json;
  let total;
  let newObj = { ...req.body, id: uuidv1() };
  try {
    if (!fs.existsSync("public/gastos.json")) {
      fs.writeFileSync(
        "public/gastos.json",
        JSON.stringify([newObj], null, 2),
        "utf8"
      );
    } else {
      fs.readFile("public/gastos.json", (err, data) => {
        if (data.length == 0) {
          fs.writeFileSync(
            "public/gastos.json",
            JSON.stringify([newObj], null, 2),
            "utf8"
          );
        } else {
          json = JSON.parse(data);
          json.push(newObj);
          total = json.reduce((sum, { monto }) => sum + monto, 0);

          fs.writeFileSync(
            "public/gastos.json",
            JSON.stringify(json, null, 2),
            "utf8"
          );
        }
      });
      fs.readFile("public/roommates.json", (err, data) => {
        let arr = JSON.parse(data);
        let debe = total / arr.length;
        let aux2 = arr.map((item) => {
          if (item.id == newObj.uid) {
            if (item.hasOwnProperty("recibe")) {
              let totalRecibe = item.recibe + newObj.monto;
              console.log(totalRecibe);
              return { ...item, recibe: totalRecibe, debe };
            } else {
              return { ...item, recibe: newObj.monto, debe };
            }
          } else {
            return { ...item, debe };
          }
        });
        fs.writeFileSync(
          "public/roommates.json",
          JSON.stringify(aux2, null, 2),
          "utf8"
        );
      });
    }
    console.log("Data successfully saved to disk");
    res.sendStatus(200);
  } catch (err) {
    console.log("An error has occurred ", err);
  }
});

app.get("/roommates", (req, res) => {
  getUsers().then((data) => {
    res.json(data);
  });
});

app.get("/gastos", (req, res) => {
  getGastos().then((data) => {
    res.json(data);
  });
});

app.delete("/gasto", (req, res) => {
  fs.readFile("public/gastos.json", (err, data) => {
    let arr = JSON.parse(data);
    let aux = arr.filter((item) => {
      return item.id !== req.query.id;
    });
    fs.writeFileSync(
      "public/gastos.json",
      JSON.stringify(aux, null, 2),
      "utf8"
    );
  });

  res.sendStatus(200);
});

app.put("/gasto", (req, res) => {
  let aux;
  let total;
  let payload = req.body;
  let newObj = { ...payload, id: uuidv1() };
  fs.readFile("public/gastos.json", (err, data) => {
    let arr = JSON.parse(data);
    aux = arr.map((item) => {
      if (item.id == req.query.id) {
        return newObj;
      } else {
        return item;
      }
    });
    total = aux.reduce((sum, { monto }) => sum + monto, 0);

    fs.writeFileSync(
      "public/gastos.json",
      JSON.stringify(aux, null, 2),
      "utf8"
    );

    fs.readFile("public/roommates.json", (err, data) => {
      let arr = JSON.parse(data);
      let debe = total / arr.length;
      let aux2 = arr.map((item) => {
        if (item.id == newObj.uid) {
          if (item.hasOwnProperty("recibe")) {
            let totalRecibe = item.recibe + newObj.monto;
            console.log(totalRecibe);
            return { ...item, recibe: totalRecibe, debe };
          } else {
            return { ...item, recibe: newObj.monto, debe };
          }
        } else {
          return { ...item, debe };
        }
      });
      fs.writeFileSync(
        "public/roommates.json",
        JSON.stringify(aux2, null, 2),
        "utf8"
      );
    });
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("en puerto 3000");
});
