*If you are reading this, it's good to know you have eyes to see my beautiful way of writing* - GPF (Greatest Programmer Francisco)

> I wrote this document with humor, not because i can't be serious, but because i want to make this reading to feel more like you are talking directly to me (and also i'm desperate to be likeable)
## How to run it

**Folder structure**

├── api
└── web
└── seeders


**Running client**

The client was built using **next.js**:

```bash
cd web
pnpm install
pnpm dev
```

**Running API**

Because i'm a great person, the backend was made using **nest.js** + **docker** (for your easy of running it).

```
cd api 
cp .env.example .env
docker compose -f compose.dev.yaml run api npx @better-auth/cli migrate # better auth migrations
docker compose -f compose.dev.yaml up 
```

*If you've done this with success, you should see in the output, your email and password for your admin.*

```bash
api       | SERVER LISTENING IN PORT :3030
api       | ADMIN EMAIL:  admin@gwr.com
api       | PASSWORD:  Ep43BmXh
```

In the seeders folder you can find a file named `items.sql` so that you can populate your items table, because (of time) i didn't provide you with the interface.

*Congrats! You are truly a genius*


## Architecture Decisions

**Stack**

*I tried to use the stack that you guys mentioned in the job's description an also i added the reason for me to choose X over Y*

- PostgreSQL:  The reason i didn't choose a NoSQL Database was because this was a **heavy-read** application as oppose of the NoSQL domain (**write-heavy**). And i also saw that this app has a heavy structure and constraints that are better modeled using a SQL database, and because i love elephants i use PostgreSQL.
- Nest.js: Being honest i just love the structure and ecosystem of a NestJS application and you guys used it so why not? I hope that gave me extra points.
- Next.js: Good, this was like a natural choice for me, so i'll be lying if i try to tell you something intelligent to justify my choice. I'll try Tanstack in one of my side projects to see how it differs from Next. 
- Docker & Docker compose: I love to run my projects in every machine and environment just using `docker compose up`... No more reasons needed. I even have my side hustle [Borrowerman](https://borrowerman.com)  running fine with just VPS + docker compose.

**Why SSE over WS?**

What a great question have you asked... (rubbing my chin)...

WS is great but i don't need to send data back to the server, so this is one of the decisions that are documenting your architecture just by making it, let me explain: you know the server is the only one that's going to be pushing data, you know this not because i've told you so, but because SSE can't be used otherwise, so by using a technology that clearly dictates my purpose i've had answer many questions.

## Improvements

- Standarize my responses
- Explicit select all the fields that i was going to be using. This can make a drastic improvement in your response time that it just feels unreal, it's incredible the amount of performance that can be obtained by just selecting **the minimum of what you are going to use**.
- Pagination in shipments and orders
- Allow for more editable fields, you can only update statuses.
- Provide a better way to update the status, such that it looks sequential
- Users management
- Enforce status change correctness on the backend
- The board endpoint can be faster: One way to do this would be implementing caching with redis and adding indexes in frequently filtered columns.
- On every minimal change i'm going to bring all the data, but keep in mind that this is not good, as a better solution will be to only update the affected parts.

> I made plenty of assumptions because (as you probably saw in the interview), i do not know much about this industry, (you should see my google history, i'm glad to say that i now know what a **pallet**, a **dock** and **ETA** means). Those assumptions may not be right but i just want you to watch the engineering behind every component rather than the assumptions itself and how ease would it be for me to change those assumptions (if wrongly they were).

*With Love - GPF (Greatest Programmer Francisco)*
