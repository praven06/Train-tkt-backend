const bcrypt = require("bcrypt");
const Username = require("../models/username.model");
const { connectDB, closeDB } = require("../database/db");
require("dotenv").config();

const saltRounds = 10;

const signup = async (req, res) => {
  await connectDB();
  try {
    const { name, username, password, email } = req.body;
    if (!username || !name || !password || !email) {
      console.log("Error in some input");
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await Username.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await Username.create({
      name,
      username,
      password: hashedPassword,
      email,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  await closeDB();
};

const login = async (req, res) => {
  await connectDB();
  try {
    const { username, password } = req.body;

    const user = await Username.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  await closeDB();
};
const AddTicket = async (req, res) => {
  await connectDB();
  const { train, classType, pnr, username, email } = req.body;

  if (!train || !classType || !pnr || !username || !email) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await Username.findOne({ username: username, email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or email" });
    }

    const newTicket = {
      ticketNumber: pnr,
      train: train,
      classType: classType,
    };

    const updatedUser = await Username.findOneAndUpdate(
      { username: username, email: email },
      { $push: { Tickets: newTicket } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to update tickets" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error adding ticket:", error);
    res.status(500).json({ message: error.message });
  } finally {
    await closeDB();
  }
};

const GetAllTickets = async (req, res) => {
  await connectDB();
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await Username.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    res.status(200).json(user.Tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    await closeDB();
  }
};
const removeTicket = async (req, res) => {
  await connectDB();
  const { username, email, ticketNumber } = req.body; 
  console.log(username, email, ticketNumber);

  try {

    if (!username || !email || !ticketNumber) {
      return res
        .status(400)
        .json({ message: "Username, email, and ticket number are required" });
    }


    const user = await Username.findOne({ username: username, email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const ticketExists = user.Tickets.some(
      (ticket) => ticket.ticketNumber === ticketNumber
    );
    if (!ticketExists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const updatedUser = await Username.findOneAndUpdate(
      { username: username, email: email },
      { $pull: { Tickets: { ticketNumber: ticketNumber } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Failed to remove ticket" });
    }
    res
      .status(200)
      .json({ message: "Ticket removed successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  } finally {
    await closeDB();
  }
};
module.exports = { signup, login, GetAllTickets, AddTicket, removeTicket };
