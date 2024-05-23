import express, { Request, Response } from "express";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";

const app = express();
const PORT = 3000;

app.use(express.json());

createConnection()
  .then(async () => {
    console.log("Connected to database");

    // Create a new user
    app.post("/users", async (req: Request, res: Response) => {
      const { name, email } = req.body;
      const userRepository = getRepository(User);
      const newUser = userRepository.create({ name, email });
      await userRepository.save(newUser);
      res.status(201).json(newUser);
    });

    // Get all users
    app.get("/users", async (_req: Request, res: Response) => {
      const userRepository = getRepository(User);
      const users = await userRepository.find();
      res.json(users);
    });

    // Get user by ID
    app.get("/users/:id", async (req: Request, res: Response) => {
      const userId = req.params.id;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });

    // Update user by ID
    app.put("/users/:id", async (req: Request, res: Response) => {
      const userId = req.params.id;
      const { name, email } = req.body;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = name;
      user.email = email;
      await userRepository.save(user);
      res.json(user);
    });

    // Delete user by ID
    app.delete("/users/:id", async (req: Request, res: Response) => {
      const userId = req.params.id;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await userRepository.remove(user);
      res.status(204).end();
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("Error connecting to database:", error));
