/**
 * ------------------------------------------------------------------------------------
 * Multiservice platform (Мультисервисная платформа)
 * ------------------------------------------------------------------------------------
 */

// Подключаем модули из пакетов npm
var express = require("express");

// Основное приложение платформы
var app = express();

// Подключаем модули из пакетов npm
var compression = require("compression");
var useragent = require("express-useragent");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var moment = require("moment");
moment.locale("ru");
var favicon = require("serve-favicon");
var clc = require("cli-color");

// Установка механизма представления handlebars
var handlebars = require("express-handlebars").create({
  defaultLayout: "apps",
  extname: "hbs",
  layoutsDir: __dirname + "/views/layouts/",
  partialsDir: [__dirname + "/views/partials/"],
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    breaklines: function(text) {
      text = handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
      return new handlebars.SafeString(text);
    }
  }
});

// Создаем переменную приложения сервера
app
  // Устанавливаем адрес сервера
  .set("host", "127.0.0.1")
  // Устанавливаем порт сервера
  .set("port", "3000");
// Устанавливаем иконку для сайта
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Сжимает данные ответа с помощью gzip
app.use(compression());

app
  // Установка механизма статических файлов проекта
  .use(express.static(__dirname + "/public"))
  .use(express.static(__dirname + "/node_modules"))
  // Защитита приложения от некоторых широко известных веб-уязвимостей
  .use(helmet());

app
  // Устанавливаем шаблонизатор для приложения - handlebars
  .engine(".hbs", handlebars.engine)
  .set("view engine", ".hbs")
  // Устанавливаем кодирование URL, позволяет конвертировать (вложенный) объект в JSON
  .use(bodyParser.json())
  // Устанавливаем кодирование URL, позволяет конвертировать (вложенный) объект в строку
  .use(bodyParser.urlencoded({ extended: true }))
  // Детали приложения клиента
  .use(useragent.express());

app.set(require("./routes")(app));

// Обобщенный обработчик 404 (промежуточное ПО)
app.use(function(req, res, next) {
  res.status(404);
  if (req.xhr || req.accepts("json,html") === "json") {
    res.send({
      error: {
        error_code: 404,
        error_msg: "Произошла 404 ошибка.",
        error_comment: "Попробуйте повторить запрос позже."
      }
    });
  } else {
    res.render("404", {
      layout: "error",
      app: { title: "Страница не найдена" }
    });
  }
});

// Обработчик ошибки 500 (промежуточное ПО)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (req.xhr || req.accepts("json,html") === "json") {
    res.send({
      error: {
        error_code: 500,
        error_msg: "Произошла 500 ошибка.",
        error_comment: "Попробуйте повторить запрос позже."
      }
    });
  } else {
    res.render("500", {
      layout: "error",
      app: { title: "Ошибка сервера" }
    });
  }
});

// APP сервер
var server = require("http").createServer(app);

// Запуск приложения сервера
server.listen(app.get("port"), function(err) {
  if (err) console.log(err);
  console.log(
    clc.white("Среда выполнения: ") + clc.green(app.get("env").toUpperCase())
  );
  console.log(
    clc.white("Сервер запущен: ") + clc.green(moment().format("llll"))
  );
  console.log(
    clc.white("Адрес сервера  : ") +
      clc.green("http://" + app.get("host") + ":" + app.get("port"))
  );

  console.log(clc.white("Нажмите Ctrl+C для завершения..."));
});
