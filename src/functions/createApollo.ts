import { ApolloServerExpressConfig } from "apollo-server-express";
import { Server } from "http";
import { createApolloServer } from "./createApolloServer";
import { craeteGraphqlUpload } from "./createGraphqlUpload";
import { createPubSub } from "./createPubSub";
import { resolvers as statusResolvers } from "../resolvers/status";
import { typeDefs as rootTypeDefs } from "../typeDefs/root";
import { typeDefs as statusTypeDefs } from "../typeDefs/status";
import { DocumentNode } from "apollo-link";

export const createApollo = ({
  context = {},
  maxFieldSize,
  maxFileSize,
  maxFiles,
  typeDefs,
  resolvers,
  ...rest
}: Omit<ApolloServerExpressConfig, "typeDefs"> & {
  typeDefs: DocumentNode | DocumentNode[];
} & {
  maxFieldSize?: number;
  maxFileSize?: number;
  maxFiles?: number;
}) => {
  const pubsub = createPubSub();

  const apolloServer = createApolloServer({
    context: async (args) => {
      if (typeof context === "object") {
        return { ...context, ...args, pubsub };
      }
      const ctx = await context(args);
      return { ...ctx, pubsub };
    },
    typeDefs: [
      rootTypeDefs,
      statusTypeDefs,
      ...(Array.isArray(typeDefs) ? typeDefs : [typeDefs]),
    ],
    resolvers: [
      statusResolvers,
      ...(resolvers
        ? Array.isArray(resolvers)
          ? resolvers
          : [resolvers]
        : []),
    ],
    ...rest,
    uploads: false,
    introspection: true,
    playground: true,
  });

  const apollo = apolloServer.getMiddleware();

  const apolloUpload = craeteGraphqlUpload({
    maxFieldSize,
    maxFileSize,
    maxFiles,
  });

  const installSubscriptions = (server: Server) =>
    apolloServer.installSubscriptionHandlers(server);

  return { apollo, apolloUpload, installSubscriptions };
};
