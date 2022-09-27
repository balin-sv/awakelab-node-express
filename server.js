const express = require("express");
const app = express();
const axios = require("axios");
const fs = require("fs");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

path = require("path");
const cors = require("cors");
const getUsers = require("./getUsers");

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

async function getRundomUser() {
  return await axios.get("https://randomuser.me/api/");
}

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

app.get("/roommates", (req, res) => {
  getUsers().then((data) => {
    res.json(data);
  });
});

app.listen(3000, () => {
  console.log("en puerto 3000");
});
