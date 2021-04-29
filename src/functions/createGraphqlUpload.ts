import { graphqlUploadExpress, UploadOptions } from "graphql-upload";

export const craeteGraphqlUpload = (options?: UploadOptions) =>
  graphqlUploadExpress(options);
