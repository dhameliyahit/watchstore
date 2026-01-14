import crypto from "crypto";

const mimeToExt = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_USER || process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || "main";
const folder = process.env.GITHUB_FOLDER || "uploads";

if (!owner || !repo || !token) {
  throw new Error(
    "Missing GitHub config (GITHUB_USER / GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN)"
  );
}

const githubBase = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
const githubJsdelivrBase = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${folder}`;

const buildFilename = (originalName, mimeType) => {
  const name = (originalName || "").trim();
  const lastDot = name.lastIndexOf(".");
  const extFromName =
    lastDot > -1 ? name.slice(lastDot).toLowerCase() : "";
  const extFromMime = mimeToExt[mimeType] || "";
  const ext = extFromName || extFromMime || ".jpg";
  const id = crypto.randomBytes(6).toString("hex");
  return `${Date.now()}-${id}${ext}`;
};

const ghRequest = async (url, options = {}) => {
  options.headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "watch-ecommerce-uploader",
    ...options.headers,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(errorText);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

const getExistingSha = async (url) => {
  try {
    const data = await ghRequest(`${url}?ref=${branch}`);
    return data.sha;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const uploadImageToGithub = async ({ buffer, originalName, mimeType }) => {
  const filename = buildFilename(originalName, mimeType);
  const fileUrl = `${githubBase}/${filename}`;
  const existingSha = await getExistingSha(fileUrl);

const uploadPayload = (sha) => ({
  message: `upload product image ${filename}`,
  content: buffer.toString("base64"),
  branch,
  ...(sha ? { sha } : {}),
});

try {
  await ghRequest(fileUrl, {
    method: "PUT",
    body: JSON.stringify(uploadPayload(existingSha)),
  });
} catch (error) {
  if (error.status === 409) {
    const freshSha = await getExistingSha(fileUrl);
    await ghRequest(fileUrl, {
      method: "PUT",
      body: JSON.stringify(uploadPayload(freshSha)),
    });
  } else {
    throw error;
  }
}

  return {
    url: `${githubJsdelivrBase}/${filename}`,
    filename,
  };
};

export const deleteImageFromGithub = async (filename) => {
  const fileUrl = `${githubBase}/${filename}`;

  // 1️⃣ Get SHA
  const data = await ghRequest(`${fileUrl}?ref=${branch}`);
  const sha = data.sha;

  // 2️⃣ Delete file
  await ghRequest(fileUrl, {
    method: "DELETE",
    body: JSON.stringify({
      message: `delete product image ${filename}`,
      sha,
      branch,
    }),
  });
};

export const extractFilename = (url) => {
  return url.split("/").pop();
};

export const listImagesFromGithub = async () => {
  const data = await ghRequest(`${githubBase}?ref=${branch}`);

  // Filter only image files
  const images = data.filter(
    (item) =>
      item.type === "file" &&
      [".jpg", ".jpeg", ".png", ".webp", ".gif"].some((ext) =>
        item.name.toLowerCase().endsWith(ext)
      )
  );

  return {
    count: images.length,
    images,
  };
};
