import { gql } from "apollo-server-core";

export const typeDefs = gql`
  scalar Upload
  scalar DateTime

  input PaginationInput {
    offset: Int = 0
    limit: Int = 50
  }
`;
