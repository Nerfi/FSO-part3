//mongo db
const mongoose = require("mongoose");
const url = process.env.URL;

mongoose.set("strictQuery", false);
mongoose.connect(url);
const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
  addedTime: Date
});

//esto lo hacemos para mas adelante los test y para poder modificar el JSON devuelto por mongoDB
phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model("Person", phoneBookSchema);