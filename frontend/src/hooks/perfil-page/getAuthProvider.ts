export function getAuthProvider(user: {
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}): "google" | "email" {
  return user.app_metadata?.provider === "google" ? "google" : "email";
}
