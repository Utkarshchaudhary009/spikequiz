/**
 * Validates whether a given URL points to an accessible PDF file.
 * Performs a HEAD request to check for a 200 OK status.
 * Optionally checks if the content-type is application/pdf (if the server provides it).
 *
 * @param url The URL to validate
 * @returns true if the URL is valid and accessible, false otherwise
 */
export async function validatePdfUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    // Some servers might block HEAD requests but allow GET, or return non-200 for HEAD.
    // Assuming standard behavior (NCERT, CBSE, Oswaal respond to HEAD properly).
    if (!res.ok) {
      return false
    }

    // Optional: check content type if provided, allowing some flexibility
    const contentType = res.headers.get('content-type')
    if (
      contentType &&
      !contentType.toLowerCase().includes('pdf') &&
      !contentType.toLowerCase().includes('application/octet-stream')
    ) {
      // It returned OK but it's explicitly not a PDF or binary stream (e.g., an HTML error page)
      return false
    }

    return true
  } catch (err) {
    if (process.env.DEBUG_SCRAPER) {
      console.error(`[validatePdfUrl] Error fetching ${url}:`, err)
    }
    return false
  }
}
