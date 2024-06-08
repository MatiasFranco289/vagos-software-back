import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello API!");
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
