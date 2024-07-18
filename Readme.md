# LNM Blogs
LNM Blogs is a blogging platform specifically designed for LNMIIT students. It allows users to create, read, update, and delete blogs, view profiles of other users, and explore their blogs. This project utilizes a modern tech stack, including Hono.js for the backend, React.js for the frontend, and PostgreSQL as the database. The backend is deployed on Cloudflare Workers, ensuring high performance and scalability.

Features:-
User Authentication: Users can sign up and log in to the platform.
Create Blogs: Authenticated users can create new blog posts.
Read Blogs: Users can browse and read blog posts created by others.
Update Blogs: Authenticated users can edit their own blog posts.
Delete Blogs: Authenticated users can delete their own blog posts.
User Profiles: Users can view their profile and the profiles of other users, along with the blogs written by them.


Tech Stack:-

Frontend:-
React.js: A JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for rapid UI development.

Backend:-
Hono.js: A fast, small, and simple web framework for Cloudflare Workers.
Prisma: An ORM for Node.js and TypeScript that provides a high-level API for database interactions.
Prisma Accelerate: For enhanced performance with connection pooling.

Database:-
PostgreSQL: A powerful, open-source object-relational database system.

Deployment:-
Backend: Deployed on Cloudflare Workers for high scalability and performance.
Frontend: Deployed on Vercel for optimized hosting and continuous deployment.



Installation Process:-

git clone https://github.com/your-username/lnm-blogs.git
cd lnm-blogs

# For frontend 
cd frontend
npm install

# For backend
cd ../backend
npm install

get postgresql database url from avien.io and put in .env
put JWT_SECRET and connection pool url in wrangler.toml

migrate database:- npx prisma migrate dev --name init_schema
generate prisma client => npx prisma generate --no-engine


at end:-
npm run dev in both frontend and backend folder(also put backend url in frontend config file)


Final Deployed Link :- https://lnm-blogs.vercel.app/

