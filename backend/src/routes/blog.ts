import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createPostInput, updatePostInput } from "@aryandumyan/bloggingwebsite-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: string
    }
}>();

//blog router will need middleware for authentication
blogRouter.use('/*', async(c,next)=>{
    const jwt = c.req.header('Authorization') || "";
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const user = await verify(jwt, c.env.JWT_SECRET);
	if (!user) {
		c.status(403);
		return c.json({ message: "You are not logged in" });
	}
    else{
        c.set("userId", user.id);
        await next();
    }
})

//add pagination means some n blogs first and when user scroll then only you get all other blogs
blogRouter.get('/bulk', async(c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        select:{
            id: true,
            content: true,
            title: true,
            author: {
                select:{
                    name: true,
                    about: true
                } 
            },
            createdAt: true
        }
    });

	return c.json({blogs}); 
})

blogRouter.get('/:id',async (c)=>{
    const id =  c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try{

        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            },
            select: {
                id: true,
                authorId: true,
                title: true,
                content: true, 
                author: {
                    select: {
                        name: true, 
                        about: true
                    }
                },
                createdAt: true,
            }
        })
        return c.json({blog})

    }catch(e){
        c.status(411);
        return c.json({message : "Internal Error"})
    }
})

blogRouter.post('/',async (c)=>{
    const body = await c.req.json();
    const {success} = createPostInput.safeParse(body);
    if(!success){
        c.status(411);
        
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const userid = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const blog = await prisma.blog.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: Number(userid),

            //middlware will give us the authorId
        }
    })

    return c.json({
        id: blog.id
    })

})

blogRouter.delete('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param("id");

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!blog) {
            return c.json({ message: "Blog not found" }, 404);
        }

        await prisma.blog.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({ message: "Blog deleted successfully" }, 200);
    } catch (e) {
        console.error('Error deleting blog:', e);
        return c.json({ message: "Internal server error" }, 500);
    }
});

blogRouter.put('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const token = c.req.header('Authorization') || "";
    if (!token) {
        return c.json({ message: "No token provided" }, 401);
    }

    let decoded;
    try {
        decoded = await verify(token, c.env.JWT_SECRET); // Use your secret key
    } catch (e) {
        return c.json({ message: "Invalid token" }, 401);
    }

    const userId = decoded.id;
    const id = c.req.param("id");
    const { title, content } = await c.req.json();

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!blog) {
            return c.json({ message: "Blog not found" }, 404);
        }

        if (blog.authorId !== userId) { 
            return c.json({ message: "Forbidden" }, 403);
        }

        const updatedBlog = await prisma.blog.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                content
            }
        });

        return c.json({ message: "Blog updated successfully", blog: updatedBlog }, 200);
    } catch (e) {
        console.error('Error updating blog:', e);
        return c.json({ message: "Internal server error" }, 500);
    }
});
 

blogRouter.put("/", async(c)=>{
    const body = await c.req.json(); 
    const {success} = updatePostInput.safeParse(body);
    if(!success){
        c.status(411);
        console.log(1);
        return c.json({
            message: "Inputs are not correct"
        }) 
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.text('updated blog');
})

