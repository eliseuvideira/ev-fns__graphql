import { gql } from "apollo-server-core";

export const typeDefs = gql`
  type Query {
    StatusGetOne: String!
    StatusGetMany: [String!]!
    StatusTotalCount: Int!
  }

  type Mutation {
    StatusUpdateOne: String!
  }

  type Subscription {
    StatusOnUpdate: String!
  }
`;
