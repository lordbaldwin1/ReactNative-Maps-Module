export const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout: number = 5000,
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout),
    ),
  ]);
};
