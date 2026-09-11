export const fetchOrGenerateResumeBuffer = async (
  url?: string,
  candidate?: any
): Promise<Buffer | null> => {
  try {
    const cloudinaryPattern = "https://res.cloudinary.com";
    let cleanUrl = (url || "").trim();

    if (cleanUrl === "generated_resume.pdf" || cleanUrl === "") {
      if (candidate) {
        const { generateCandidatePdfBuffer } = await import("./resumeGenerator");
        return await generateCandidatePdfBuffer(candidate);
      }
      return null;
    }

    if (cleanUrl.includes(cloudinaryPattern)) {
      cleanUrl = cleanUrl.substring(cleanUrl.indexOf(cloudinaryPattern));
    }

    // 1. Remote Storage URL
    if (
      (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) &&
      !cleanUrl.includes("/uploads/") &&
      !cleanUrl.includes("localhost")
    ) {
      try {
        const response = await fetch(cleanUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          return Buffer.from(arrayBuffer);
        } else {
          console.error(`Failed to fetch remote resume: ${response.status} ${response.statusText}`);
          throw new Error("Remote fetch failed");
        }
      } catch (err) {
        console.error("Remote resume download failed, falling back to dynamic generation");
        if (candidate) {
          const { generateCandidatePdfBuffer } = await import("./resumeGenerator");
          return await generateCandidatePdfBuffer(candidate);
        }
      }
    }

    // 2. Local File
    const uploadsDir = path.join(process.cwd(), "uploads");
    let localFilePath = "";
    if (cleanUrl.startsWith("/uploads/")) {
      localFilePath = path.join(process.cwd(), cleanUrl);
    } else if (cleanUrl && !cleanUrl.startsWith("http")) {
      localFilePath = path.join(uploadsDir, cleanUrl);
    }

    if (localFilePath) {
      try {
        return await fs.promises.readFile(localFilePath);
      } catch (err) {
        console.warn(`Local resume not found at ${localFilePath}, generating dynamically`);
        if (candidate) {
          const { generateCandidatePdfBuffer } = await import("./resumeGenerator");
          return await generateCandidatePdfBuffer(candidate);
        }
      }
    }

    // 3. Fallback Generation
    if (candidate) {
      const { generateCandidatePdfBuffer } = await import("./resumeGenerator");
      return await generateCandidatePdfBuffer(candidate);
    }

    return null;
  } catch (err) {
    console.error("Error in fetchOrGenerateResumeBuffer:", err);
    return null;
  }
};
