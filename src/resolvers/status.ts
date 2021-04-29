import { sample } from "lodash";
import { resolver } from "../functions/resolver";
import { subscription } from "../functions/subscription";

const STATUSES = ["😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

let currentStatus = sample(STATUSES);

const status = resolver(async () => currentStatus);

const allStatus = resolver(async () => STATUSES);

const totalStatus = resolver(async () => STATUSES.length);

const updateStatus = resolver(async (_, args, { pubsub }) => {
  currentStatus = sample(STATUSES.filter((status) => status !== currentStatus));

  pubsub.publish("onUpdateStatus", { onUpdateStatus: currentStatus });

  return currentStatus;
});

const onUpdateStatus = subscription(async (_, args, { pubsub }) =>
  pubsub.asyncIterator("onUpdateStatus"),
);

export const resolvers = {
  Query: {
    allStatus,
    status,
    totalStatus,
  },

  Mutation: {
    updateStatus,
  },

  Subscription: {
    onUpdateStatus,
  },
};
