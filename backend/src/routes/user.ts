import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { verify } from "hono/jwt";
import { signupInput, signinInput } from "@aryandumyan/bloggingwebsite-common";

export const userRouter = new Hono<{
    //if we have environment variable then we have to pass this here
    Bindings: {
        DATABASE_URL: string; //we have to tell hono that this is string otherwise typescript will create problem
        JWT_SECRET: string;
    } 
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    //curly bracket aayegi kyoki success aak object hoga.
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
  
    //zod and hashed the password

    try{
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                name: body.name
            }
        })
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
        return c.json({ jwt}); 
        
    }catch(e){
        console.log(e);
        c.status(500);
        return c.text('Server Error')
    }

})


userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
  
    //zod and hashed the password
    try{
        const user = await prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password,
            }
        })
        if(!user){
            c.status(403);
            return c.json({ error: "user not found" });
        }
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
        return c.json({jwt})
    }catch(e){
        console.log(e);
        c.status(500);
        return c.text('Server Error')
    }

})






userRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization') || "";
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    try {
        const user = await verify(jwt, c.env.JWT_SECRET);
        if (!user) {
            c.status(403);
            return c.json({ message: "You are not logged in" });
        } else {
            (c as any).userId = user.id; // Set the userId in the context
            await next();
        }
    } catch (e) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
});

// Get current user profile
userRouter.get('/me', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = (c as any).userId; // Retrieve the userId from the context
    if (!userId) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { blogs: true },
        });
        if (!user) {
            c.status(404);
            return c.json({ error: "User not found" });
        }
        return c.json(user);
    } catch (e) {
        console.log(e);
        c.status(500);
        return c.text('Server Error');
    }
});


userRouter.put('/me', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = (c as any).userId; // Retrieve the userId from the context
    if (!userId) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }

    try{
        
        const body = await c.req.json();
        const { about } = body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { about },
        });

        return c.json(updatedUser);

    }catch (e) {
        console.log(e);
        c.status(500);
        return c.text('Server Error');
    }
})
 
userRouter.get('/:id', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.req.param('id');

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: { blogs: true },
        });

        if (!user) {
            return c.json({ message: "User not found" }, 404);
        }

        return c.json(user, 200);
    } catch (e) {
        console.error('Error fetching user data:', e);
        return c.json({ message: "Internal server error" }, 500);
    }

})