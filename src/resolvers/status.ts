import { resolver } from "../functions/resolver";
import { subscription } from "../functions/subscription";
import { status } from "../models/status";

const StatusGetOne = resolver(async () => status.current);

const StatusGetMany = resolver(async () => status.all);

const StatusTotalCount = resolver(async () => status.all.length);

const StatusUpdateOne = resolver(async (_, args, { pubsub }) => {
  status.randomize();

  pubsub.publish("StatusOnUpdate", { StatusOnUpdate: status.current });

  return status.current;
});

const StatusOnUpdate = subscription(async (_, args, { pubsub }) =>
  pubsub.asyncIterator("StatusOnUpdate"),
);

export const resolvers = {
  Query: {
    StatusGetMany,
    StatusGetOne,
    StatusTotalCount,
  },

  Mutation: {
    StatusUpdateOne,
  },

  Subscription: {
    StatusOnUpdate,
  },
};
