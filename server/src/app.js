import express from "express";
const app = express();

import loginRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import bodyParser from "body-parser";

app.use(express.json());
app.use(bodyParser.json());

app.post("/api", loginRouter);
app.get("/api/users", usersRouter);
// app.use("/api", employeesRouter);
// app.use("/api",productRoutes);
// app.use("/api", saleRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: "Endpoint not found",
  });
});

export default app;
