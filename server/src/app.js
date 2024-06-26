import express from "express";
const app = express();

import loginRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import usersInfoRouter from "./routes/user_info.routes.js";
import bodyParser from "body-parser";

// app.use(express.json());
app.use(bodyParser.json());

app.post("/api", loginRouter);
app.get("/api/users", usersRouter);
app.post("/api/users", usersRouter);
app.post("/api/user_info", usersInfoRouter);
app.get("/api/user_info/:id", usersInfoRouter);
app.put("/api/user_info/:id", usersInfoRouter);
app.delete("/api/user_info/:id", usersInfoRouter);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

export default app;
