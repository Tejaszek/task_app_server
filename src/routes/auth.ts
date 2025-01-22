import { Router, Request, Response } from 'express';
import exp from 'node:constants';
import { db } from '../db';
import { NewUser, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcryprtjs from "bcryptjs";

const authRouther = Router();

interface signUpBody {
    name: string;
    email: string;
    password: string;
}
interface loginBody {

    email: string;
    password: string;
}
authRouther.post("/signUp", async (req: Request<{}, {}, signUpBody>, res: Response) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length) {
            res.status(400).json({
                msg: "user with the same email already exists"
            });
            return;
        }
        const hashedPassword = await bcryprtjs.hash(password, 8);
        const newUser: NewUser = {
            name: name,
            email: email,
            password: hashedPassword

        }

        const [user] = await db.insert(users).values(newUser).returning()
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
})


authRouther.post("/login", async (req: Request<{}, {}, loginBody>, res: Response) => {
    try {
        const { email, password } = req.body
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));

        if (!existingUser) {
            res.send(400).json({
                msg: "User with the email does not exist!"
            });
            return;
        }
        const isMatch = await bcryprtjs.compare(password, existingUser.password);

        if (!isMatch) {
            res.status(400).json({ msg: "Incorrect password" });
            return;
        }

        res.json(existingUser);

    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
})



authRouther.get("/", (req, res) => {
    res.send("hey there! from auth");
});

export default authRouther;