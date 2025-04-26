// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();

console.log("MONGO_CONNECTION_STRING", process.env.MONGO_CONNECTION_STRING);

const { MONGO_CONNECTION_STRING } = process.env;


mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());


app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.getUserById(id)
      .then((user) => {
        if (!user) {
          res.status(404).send("User not found");
        } else {
          res.send(user);
        }
      })
      .catch((err) => res.status(500).send(err.message));
  });



app.post("/users", (req, res) => {
    const userToAdd = req.body;
    
    userService.addUser(userToAdd)
      .then((newUser) => res.status(201).send(newUser))
      .catch((err) => res.status(500).send(err.message));
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});




app.get("/users", (req, res) => {
  const { name, job } = req.query;
  let query;
  if (name && job) {
    query = userService.getUsersByNameAndJob(name, job);
  } else if (name) {
    query = userService.findUserByName(name)
  } else if (job) {
    query = userService.findUserByJob(job);
  } else {
     query = userService.getUsers();
  }

  query
    .then((users) => res.send({ users_list: users }))
    .catch((err) => res.status(500).send(err.message));  
});




app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService.deleteUserById(id)
    .then((deleted) => {
      if (deleted) {
        res.status(200).send("User deleted");
      } else {
        res.status(404).send("User not found");
      }
    })
    .catch((err) => res.status(500).send(err.message));
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

