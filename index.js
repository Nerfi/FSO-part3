const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/api/persons/:id", (request, response) => {
  // si no hay entrada 404
  const idSend = Number(request.params.id);
  const user = persons.find((p) => p.id === idSend);

  if (user) {
    response.send(user);
  } else {
    response.status(404).end();
  }
  
});

app.get("/info", (request, response) => {
  const personsLength = persons.length;

  const addedTime = new Date();

  response.send(`Phoneboook has indo for ${personsLength} <br> ${addedTime}`);
});

app.delete("/api/persons/:id", (request, response) => {
  const idSend = Number(request.params.id);
  const deleteUser = persons.filter((p) => p.id !== idSend);
  response.status(204).end();
});


app.post("/api/persons", (request, response) => {
  const randomId = Math.floor(Math.random() * 100);
  const body = request.body;

  const personsNames = persons.map((p) => p.name.toLowerCase());

  if (personsNames.includes(body.name)) {
    response.status(400).json({
      error: "name must be unique",
    });
  }

  if (!body.name || !body.number) {
    response.status(400).json({
      error: "content missing",
    });
  }

  const newPerson = {
    id: randomId,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  //devolvemos el recurso si todo ha salido bien
  response.json(newPerson);
});



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})