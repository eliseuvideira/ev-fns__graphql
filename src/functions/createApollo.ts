import { ApolloServerExpressConfig } from "apollo-server-express";
import { Server } from "http";
import { createApolloServer } from "./createApolloServer";
import { createPubSub } from "./createPubSub";

export const createApollo = ({
  context = {},
  ...rest
}: ApolloServerExpressConfig) => {
  const pubsub = createPubSub();

  const apolloServer = createApolloServer({
    context: async (...args) => {
      if (typeof context === "object") {
        return { ...context, pubsub };
      }
      const ctx = await context(...args);
      return { ...ctx, pubsub };
    },
    ...rest,
    uploads: true,
    introspection: true,
    playground: true,
  });

  const middleware = apolloServer.getMiddleware();

  const installSubscriptions = (server: Server) =>
    apolloServer.installSubscriptionHandlers(server);

  return { middleware, installSubscriptions };
};
