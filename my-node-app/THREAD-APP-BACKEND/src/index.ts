
import express from "express";
// import cors from "cors";


import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }

      type Mutation {
        createUser(
          firstName: String!
          lastName: String!
          email: String!
          password: String!
        ): Boolean
      }
    `,

    resolvers: {
      Query: {
        hello: () => `Hey there, I am a GraphQL Server`,

        say: (_, { name }: { name: string }) =>
          `Hey ${name}, How are you?`,
      },

      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_salt",
            },
          });
          return true;
        },
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
  console.log('DATABASE_URL:  ', process.env.DATABASE_URL);

  app.listen(PORT, () => {
    console.log("Server started at port:", PORT);
  });
}

init();
