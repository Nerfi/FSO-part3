require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneBook = require("./models/phoneBook");

const app = express();

app.use(express.json());

app.use(cors());

//Para hacer que express muestre contenido estático, la página index.html y el JavaScript, etc., necesitamos un middleware integrado de express llamado static.
app.use(express.static("dist"));

//exercise 3.8
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
//las lineas de abajo son el equivalente a la funcion que tenemos arriba

// morgan.token('body', (req, res) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

//error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id loco" });
  }
  //esta linea next(error) esta ahi ya que si el nombre del error no es CastError lo que hara sera pasarle el error
  //al middleware que tiene express por defecto
  next(error);
};

app.get("/api/persons", (request, response, next) => {
  PhoneBook.find({})
    .then((notes) => {
      response.json(notes);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  // si no hay entrada 404
  const idSend = request.params.id;

  PhoneBook.findById(idSend)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
      //response.status(400).send({ error: 'malformatted id' })
    });
});

app.get("/info", (request, response, next) => {
  PhoneBook.find({})
    .then((notes) => {
      response.send(`Phoneboook has info for ${notes.length} <br>  `);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response) => {
  try {
    PhoneBook.findByIdAndDelete(request.params.id).then((res) => {
      response.status(204).end();
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.status(400).json({
      error: "content missing",
    });
  }

  const newPerson = new PhoneBook({
    name: body.name,
    number: body.number,
    addedTime: new Date().toISOString(),
  });

  newPerson
    .save()
    .then((res) => {
      response.json(res);
    })
    .catch((err) => console.log(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const updatedPerson = {
    name: body.name,
    number: body.number,
  };

  //update

  PhoneBook.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then((updated) => {
      response.json(updated);
    })
    .catch((err) => next(err));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
