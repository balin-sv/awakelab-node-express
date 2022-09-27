const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");

path = require("path");
const cors = require("cors");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

async function getRundomUser() {
  return await axios.get("https://randomuser.me/api/");
}

// app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/roommate", (req, res) => {
  getRundomUser().then((data) => {
    const newRoomme = `${data.data.results[0].name.first} ${data.data.results[0].name.last}`;
    const newData = {
      name: newRoomme,
    };

    try {
      if (!fs.existsSync("roommates.json")) {
        fs.writeFileSync(
          "roommates.json",
          JSON.stringify([newData], null, 2),
          "utf8"
        );
      } else {
        fs.readFile("roommates.json", (err, data) => {
          if (data.length == 0) {
            fs.writeFileSync(
              "roommates.json",
              JSON.stringify([newData], null, 2),
              "utf8"
            );
          } else {
            let json = JSON.parse(data);
            json.push(newData);
            fs.writeFileSync(
              "roommates.json",
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

app.get("/roommates", (req, res) => {
  fs.readFile("roommates.json", (err, data) => {
    if (data.length == 0) {
      return;
    } else {
      let json = JSON.parse(data);
      res.json(json);
    }
  });
});

app.listen(3000, () => {
  console.log("ESCUCHANDO PUERTO 3000");
});

// const getUsers = () => {
//   let users = fs.readFileSync("roommates.json");
//   return JSON.parse(users);
// };

// const setUsers = (users) => {
//   let newUsersObject = JSON.stringify(users, null, 2);
//   fs.writeFileSync("roommates.json", newUsersObject);
// };
