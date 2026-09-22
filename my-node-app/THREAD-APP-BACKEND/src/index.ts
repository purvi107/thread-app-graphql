import express from "express";
// import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,

    resolvers: {
      Query: {
        hello: () => `Hey there, I am a GraphQL Server`,
        say: (_, {name}: {name: String})=> `hey ${name}, How are you?`
      },

    },
  });

  await gqlServer.start();

  // Middleware MUST come before /graphql
  // app.use(cors());
  app.use(express.json());

  // Normal Express route
  app.get("/", (req, res) => {
    res.json({
      message: "Server is up and running",
    });
  });

  // Apollo GraphQL route
  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log("Server started at port:", PORT);
  });
}

init();