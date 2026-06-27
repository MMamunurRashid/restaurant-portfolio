const isAbsoluteFileUrl = (filePath: string) =>
  /^(https?:|data:)/i.test(filePath);

export function getStoredFilePath(
  filePath: string,
  uploadPath?: string,
): string;
export function getStoredFilePath(
  filePath?: string | null,
  uploadPath?: string,
): string | undefined;
export function getStoredFilePath(
  filePath?: string | null,
  uploadPath?: string,
) {
  const cleanPath = filePath?.trim();

  if (!cleanPath) return undefined;
  if (isAbsoluteFileUrl(cleanPath)) return cleanPath;
  if (!uploadPath) return cleanPath;

  return `/${uploadPath.replace(/^\/+|\/+$/g, '')}/${cleanPath.replace(
    /^\/+/,
    '',
  )}`;
};
