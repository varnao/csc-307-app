// index.js
import express from "express";

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };


const app = express();
const port = 8000;

app.use(express.json());

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);
  
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  });

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserByJob = (job) => {
  return users["users_list"].filter(
    (user) => user["job"] === job
  );
};

const filterUsers = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
}


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name && job) {
    let result = filterUsers(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else if (job) {
    let result = findUserByJob(job);
    result = { users_list: result }
    res.send(result);
  } else {
    res.send(users);
  }
});

const deleteUserById = (id) => {
  // find index of user to delete
  const userToDelete = users["users_list"].findIndex(user => user.id === id);
  if (userToDelete !== -1) { // if user was found
    users["users_list"].splice(userToDelete, 1) //starting at this index, remove 1 item
    return true;
  }
  return false;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deletedUser = deleteUserById(id)
  if (deletedUser) {
    res.status(200).send("User was successfully deleted")
  } else {
    res.status(404).send("Unable to delete user")
  }
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

