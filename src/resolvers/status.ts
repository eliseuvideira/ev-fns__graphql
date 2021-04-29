import { sample } from "lodash";
import { resolver } from "../functions/resolver";
import { subscription } from "../functions/subscription";

const STATUSES = ["😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

let currentStatus = sample(STATUSES);

const status = resolver(async () => currentStatus);

const statusUpdate = resolver(async (_, args, { pubsub }) => {
  currentStatus = sample(STATUSES.filter((status) => status !== currentStatus));

  pubsub.publish("statusUpdated", { statusUpdated: currentStatus });

  return currentStatus;
});

const statusUpdated = subscription(async (_, args, { pubsub }) =>
  pubsub.asyncIterator("statusUpdated"),
);

export const resolvers = {
  Query: {
    status,
  },

  Mutation: {
    statusUpdate,
  },

  Subscription: {
    statusUpdated,
  },
};
