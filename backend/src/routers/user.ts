import { Hono } from "hono";
import { getPrisma } from "../prisma-helper.js";
import type { Env } from "../types";
import { hashing, compareHash } from "../utility.js";
import { sign } from "hono/jwt";
import {  setCookie } from "hono/cookie";
import { loginSchema, signupSchema} from "@kartik010700/common";
import type { LoginParams, SignupParams } from "@kartik010700/common";
import { authMiddleware } from "../middlewares/authMiddleware.js";

declare const console: {
  error(...args: any[]): void;
  warn(...args: any[]): void;
  log(...args: any[]): void;
  info(...args: any[]): void;
};

const user = new Hono<Env>();
// ---------------- SIGN-UP ----------------
user.post("/sign-up", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body : SignupParams = await c.req.json();
  const validatedBody = signupSchema.safeParse(body);
  if(!validatedBody.success){
    c.status(400);
    return c.json({
      success: false,
      message:"invalid inputs",
      errors: validatedBody.error.format(),
    });
  }
  const data = validatedBody.data;
  const existing = await prisma.user.findUnique({
    where:{email : data.email}
  });
  if(existing){
    c.status(400)
    return c.json({
        success: false,
        message: "user already exists"
    });
  }
  if (data.password !== data.confirmPassword) {
    c.status(400);
    return c.json({ success: false, message: "Passwords didn't match" });
  }

  const hashedPassword = await hashing(data.password);

  try {
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const payload = {
      id: newUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
    };

    const token = await sign(payload, c.env.JWT_SECRET);
setCookie(c, "token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",   // 👈 required for cross-origin cookies
});
    return c.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    c.status(500);
    return c.json({ success: false, message: "Internal server error" });
  }
});

// ---------------- SIGN-IN ----------------
user.post("/sign-in", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body : LoginParams = await c.req.json();

  const validatedBody = loginSchema.safeParse(body);
  if(!validatedBody.success){
    c.status(400);
    return c.json({
      success: false,
      message: "invalid inputs",
      errors: validatedBody.error.format()
    });
  }
  const data = validatedBody.data;

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    c.status(401);
    return c.json({ success: false, message: "Invalid email or password" });
  }


const isValid = await compareHash(data.password, user.password);
        if (!isValid) {
            c.status(401);
        return c.json({ success: false, message: "Invalid email or password" });
    }

  const payload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 15,
  };

  const token = await sign(payload, c.env.JWT_SECRET);
setCookie(c, "token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",   // 👈 required for cross-origin cookies
});

  return c.json({
    success: true,
    message: "User logged in successfully",
    user,
  });
});
//----------------auth route--------------//
user.get("/me", authMiddleware ,async(c)=>{
    try{
        if(!c.get("userId")){
            c.status(401);
            c.json({
                success: false, message:"unauthorised user"
            });
        }
        const prisma = getPrisma(c.env.DATABASE_URL);
        const user = await prisma.user.findUnique({
            where:{
                id: c.get("userId")
            }
        })
        if(!user){
            c.status(401);
            return c.json({success:false,
                message:"un authenticated user"
            });
        }
        c.status(200);
        return c.json({
            success: true,
            message:"user found",
            user: {id: user.id,name: user.name, email:user.email}
        });
    }
    catch(e){
        c.status(500);
        return c.json({
            succesS:false,
            message: "internal server error",
        })
    }
})


user.post("/sign-out", async (c) => {
setCookie(c, "token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "None",   // 👈 required for cross-origin cookies
  expires: new Date(0), // Set the cookie to expire in the past
});
  c.status(200);
  return c.json({
    success: true,
    message: "User logged out successfully",
  });
});
export default user;
