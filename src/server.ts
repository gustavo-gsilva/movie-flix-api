import express from "express";
import { prisma } from "../lib/prisma.js";
import { json } from "node:stream/consumers";

const port = 3000;
const app = express();
app.use(express.json());

app.get("/movies", async (_, res) => {
   const movies = await prisma.movie.findMany({
      orderBy: {
         title: "asc",
      },
      include: {
         genres: true,
         languages: true,
      },
   });
   res.json(movies);
});

app.post("/movies", async (req, res) => {
   const { id, title, genre_id, language_id, oscar_count, release_date } =
      req.body;

   try {
      await prisma.movie.create({
         data: {
            id,
            title,
            genre_id,
            language_id,
            oscar_count,
            release_date: new Date(release_date),
         },
      });
   } catch (error) {
      res.status(500).send({ message: "Falha ao cadastrar um filme" });
   }

   res.status(201).send();
});

app.listen(port, () => {
   console.log(`Servidor em execução na porta ${port}`);
});
