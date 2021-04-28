import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";

export const createApolloServer = (config: ApolloServerExpressConfig) =>
  new ApolloServer(config);
