const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.static("public"));
app.use(express.json());

function getGastos() {
  return new Promise((res, rej) => {
    fs.readFile("public/gastos.json", (err, data) => {
      if (data.length == 0) {
        return;
      } else {
        res(JSON.parse(data));
      }
    });
  });
}
module.exports = getGastos;
