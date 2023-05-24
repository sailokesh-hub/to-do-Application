const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

// API 1

app.get("/todos/", async (request, response) => {
  const { status = "", priority = "", search_q = "" } = request.query;
  const statusQuery = `select * from todo where status like "%${status}%" and priority like "%${priority}%" and todo like "%${search_q}%";`;
  const dbResponse = await database.all(statusQuery);
  response.send(dbResponse);
});

// API 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const statusQuery = `select * from todo where id=${todoId};`;
  const dbResponse = await database.get(statusQuery);
  response.send(dbResponse);
});

// API 3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const statusQuery = `insert into todo(id, todo, priority, status) values(${id}, '${todo}', '${priority}', '${status}');`;
  await database.run(statusQuery);
  response.send("Todo Successfully Added");
});

// API 4

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo = "", priority = "", status = "" } = request.body;
  if (todo !== "") {
    const query = `update todo set todo='${todo}' where id = ${todoId};`;
    await database.run(query);
    response.send("Todo Updated");
  } else if (priority !== "") {
    const query = `update todo set priority='${priority}' where id = ${todoId};`;
    await database.run(query);
    response.send("Priority Updated");
  } else if (status !== "") {
    const query = `update todo set status='${status}' where id = ${todoId};`;
    await database.run(query);
    response.send("Status Updated");
  }
});

//API 5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `delete from todo where id = ${todoId};`;
  await database.run(query);
  response.send("Todo Deleted");
});

module.exports = app;
