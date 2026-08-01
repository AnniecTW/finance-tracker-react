import { app } from "@azure/functions";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

const account = process.env.AZURE_STORAGE_ACCOUNT;
const accountKey = process.env.AZURE_STORAGE_KEY;
const containerName = "transaction-images";

const credential = new StorageSharedKeyCredential(account, accountKey);

app.http("upload-token", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const blobName = randomUUID();

      const now = Date.now();
      const startsOn = new Date(now - 60 * 1000);
      const expiresOn = new Date(now + 5 * 60 * 1000);

      const sas = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse("cw"),
          startsOn,
          expiresOn,
          protocol: SASProtocol.Https,
        },
        credential,
      ).toString();

      const baseUrl = `https://${account}.blob.core.windows.net/${containerName}/${blobName}`;

      return {
        jsonBody: {
          uploadUrl: `${baseUrl}?${sas}`,
          publicUrl: baseUrl,
        },
      };
    } catch (err) {
      context.log("upload-token error:", err);
      return {
        status: 500,
        jsonBody: { error: "Could not create upload token" },
      };
    }
  },
});
