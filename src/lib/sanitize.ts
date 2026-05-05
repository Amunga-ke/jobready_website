import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Strips dangerous tags like <script>, <iframe>, <object>, <embed>
 * while preserving safe formatting tags like <p>, <ul>, <ol>, <strong>, etc.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "b", "em", "i", "u", "s", "del", "ins",
      "ul", "ol", "li",
      "a", "link",
      "blockquote", "cite", "q",
      "code", "pre",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
      "img", "figure", "figcaption", "picture",
      "div", "span", "section", "article", "aside", "main", "nav", "header", "footer",
      "details", "summary",
      "sup", "sub",
      "mark", "small", "abbr",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "class", "id", "style",
      "alt", "title", "src", "width", "height", "loading", "decoding",
      "colspan", "rowspan", "scope",
      "open", "datetime",
    ],
    ALLOW_DATA_ATTR: false,
  });
}
