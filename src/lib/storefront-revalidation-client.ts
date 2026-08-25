export async function requestStorefrontRevalidation(
  accessToken: string,
  scope: "homepage"
) {
  const response = await fetch("/api/admin/storefront-cache", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ scope })
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Storefront cache could not be refreshed.");
  }
}
