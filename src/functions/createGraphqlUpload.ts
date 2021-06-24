import { graphqlUploadExpress, UploadOptions } from "graphql-upload";

export const createGraphqlUpload = (options?: UploadOptions) =>
  graphqlUploadExpress(options);
