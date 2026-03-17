import { BlobServiceClient } from "@azure/storage-blob";

function getContainerClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING ?? "";
  const containerName = process.env.AZURE_STORAGE_CONTAINER ?? "agreements";

  if (!connectionString) {
    throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured");
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient.getContainerClient(containerName);
}

export async function uploadFile(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(key);
  await blockBlobClient.uploadData(body, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return key;
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const { generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = await import("@azure/storage-blob");

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING ?? "";
  const container = process.env.AZURE_STORAGE_CONTAINER ?? "agreements";

  // Parse account name and key from connection string
  const accountName = connStr.match(/AccountName=([^;]+)/)?.[1] ?? "";
  const accountKey = connStr.match(/AccountKey=([^;]+)/)?.[1] ?? "";

  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: key,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn: new Date(Date.now() + expiresIn * 1000),
    },
    sharedKeyCredential
  ).toString();

  return `https://${accountName}.blob.core.windows.net/${container}/${key}?${sasToken}`;
}
