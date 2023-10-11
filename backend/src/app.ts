import express from "express";
import cors from "cors";
import dbConnect from "./config/mongo";
import users from "./routes/auth"

const app = express();

app.use(cors());
app.use(express.json());

const port: string | number = process.env.PORT || 3000;

app.use("/api/auth", users);

app.listen(port, () => {
    console.log(`Ready in the port ${port}`);
})

dbConnect().then(() => {
    console.log("Successful connection");
});

export default app;