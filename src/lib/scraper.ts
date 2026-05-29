import * as cheerio from 'cheerio';

/**
 * Extremely basic scraper for MVP to prove the concept.
 * Given a URL, grabs the headline tags and paragraphs.
 */
export async function scrapeContextFromUrl(url: string): Promise<string> {
  if (!url) return '';

  try {
    // Add protocol if missing to avoid simple fetch errors
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const res = await fetch(formattedUrl, {
      // Mocking a standard browser User-Agent helps bypass generic basic bot blockers
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`Scraping failed for ${formattedUrl} with status: ${res.status}`);
      return `Target URL structure (Could not extract body content from ${formattedUrl})`;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and SVG maps that add token bloat
    $('script, style, noscript, svg').remove();

    // Extract core context
    const tagsToExtract = ['h1', 'h2', 'h3', 'p', 'meta[name="description"]'];
    const contextPool: string[] = [];

    tagsToExtract.forEach((tag) => {
      if (tag === 'meta[name="description"]') {
        const desc = $('meta[name="description"]').attr('content');
        if (desc) contextPool.push(`Meta Description: ${desc}`);
      } else {
        $(tag).each((_, element) => {
          const text = $(element).text().replace(/\s+/g, ' ').trim();
          if (text.length > 20) { // filter out random minimal strings
             contextPool.push(text);
          }
        });
      }
    });

    // Deduplicate and cap length to avoid overloading prompt token limits
    const uniqueContext = Array.from(new Set(contextPool)).join('\\n');
    return uniqueContext.substring(0, 3000); 

  } catch (error) {
    console.warn(`Scraper encountered error for ${url}:`, error);
    return `Could not parse ${url}. Attempt to interpret URL generically.`;
  }
}
