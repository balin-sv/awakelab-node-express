const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.static("public"));
app.use(express.json());

function getUsers() {
  return new Promise((res, rej) => {
    fs.readFile("public/roommates.json", (err, data) => {
      if (data.length == 0) {
        return;
      } else {
        res(JSON.parse(data));
      }
    });
  });
}
module.exports = getUsers;
