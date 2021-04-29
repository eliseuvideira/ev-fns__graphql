import { gql } from "apollo-server-core";

export const typeDefs = gql`
  type Query {
    status: String!
    allStatus: [String!]!
    totalStatus: Int!
  }

  type Mutation {
    updateStatus: String!
  }

  type Subscription {
    updatedStatus: String!
  }
`;
