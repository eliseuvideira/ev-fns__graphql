import { gql } from "apollo-server-core";

export const typeDefs = gql`
  type Query {
    status: String!
  }

  type Mutation {
    statusUpdate: String!
  }

  type Subscription {
    statusUpdated: String!
  }
`;
