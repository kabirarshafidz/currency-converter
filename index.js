import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.frankfurter.app/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var data;

app.get("/", async (req, res) => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let currentDate = `${year}-${month}-${day}`;
  const currencies = await axios.get(API_URL + "currencies");
  res.render("index.ejs", {
    currencyOption: currencies.data,
    content: data,
    date: currentDate,
  });
});

app.post("/convert", async (req, res) => {
  let date = req.body["date"];
  let amountFrom = req.body["from-amount"];
  let currencyFrom = req.body["from-currency"];
  let amountTo;
  let currencyTo = req.body["to-currency"];
  const result = await axios.get(
    API_URL +
      `${date}?amount=${amountFrom}&from=${currencyFrom}&to=${currencyTo}`
  );
  let tempoData = result.data;
  for (var key in result.data.rates) {
    amountTo = result.data.rates[key];
  }
  data = {
    newDate: date,
    fromAmount: amountFrom,
    fromCurrency: currencyFrom,
    toAmount: amountTo,
    toCurrency: currencyTo,
  };
  console.log(data);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
