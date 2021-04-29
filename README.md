# @ev-fns/graphql

Apollo Server wrapper

- createApollo
- resolver
- subscription

## Install

```sh
yarn add express graphql apollo-server-core @ev-fns/graphql
```

## Usage

```js
const { gql } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const { createApollo, resolver, subscription } = require("@ev-fns/graphql");

const quotes = [];

const typeDefs = gql`
  type Query {
    allQuotes: [String!]!
  }
  type Mutation {
    addQuote(quote: String!): String!
  }
  type Subscription {
    quoteAdded: String!
  }
`;

const resolvers = {
  Query: {
    allQuotes: resolver(async () => quotes),
  },
  Mutation: {
    addQuote: resolver(async (_, { quote }, { pubsub }) => {
      quotes.push(quote);
      pubsub.publish("quoteAdded", { quoteAdded: quote });
      return quote;
    }),
  },
  Subscription: {
    quoteAdded: subscription(async (_, args, { pubsub }) =>
      pubsub.asyncIterator("quoteAdded"),
    ),
  },
};

const app = express();

const apollo = createApollo({
  typeDefs,
  resolvers,
  context: () => ({}),
});

app.use(apollo.middleware);

const server = http.createServer(app);

apollo.installSubscriptions(server);

server.listen(3000, () => {
  console.log("listening at http://localhost:3000");
});
```
