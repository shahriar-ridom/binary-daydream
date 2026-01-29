export async function uploadToR2(file: File) {
  // Get the Presigned URL from our API
  const response = await fetch("/api/products/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!response.ok) throw new Error("Failed to get upload URL");

  const { signedUrl, fileKey } = await response.json();

  // Upload the file directly to R2
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) throw new Error("Upload to R2 failed");

  return fileKey;
}
