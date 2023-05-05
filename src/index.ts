import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import { router } from "./routes/routes";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});

export default app;
