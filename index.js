import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";
import sendEmail from "./mail.js";
import Main from "./modules/schema.js";
import Card from "./modules/schema2.js";
import { google } from "googleapis";
dotenv.config();
const app = express();

const URI = process.env.URI;
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const users = await Main.find();
    res.status(200).json(users.map((user) => user.name));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/add", async (req, res) => {
  try {
    const users = await Main.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/add", async (req, res) => {
  try {
    const newUser = new Main({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
    });

    sendEmail(req.body.username, req.body.name)
      .then(() =>
        console.log(`Email successfully sent! TO ${req.body.username}`)
      )
      .catch((error) => console.error("Failed to send email:", error));
    await newUser.save();

    // console.log(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/login", (req, res) => {});

app.get("/card", async (req, res) => {
  try {
    const data = await Card.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
});
app.post("/card", async (req, res) => {
  if (!req.body.day || !req.body.task) {
    return res.status(400).json({ message: "Day and task are required." });
  }
  const newCard = new Card({
    day: req.body.day,
    task: req.body.task,
  });
  try {
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
