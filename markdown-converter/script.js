const markdownInput = document.getElementById("markdown-input");
const htmlOutput = document.getElementById("html-output");
const preview = document.getElementById("preview");
const clearBtn = document.getElementById("clear-btn");

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function convertInline(text) {
    text = escapeHtml(text);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/(^|[^\w])_(.+?)_(?!\w)/g, "$1<em>$2</em>");
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return text;
}

function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let html = [];
    let inUl = false, inOl = false, inCodeBlock = false;
    let codeBuffer = [], paragraphBuffer = [];

    function flushParagraph() {
        if (paragraphBuffer.length) {
            html.push("<p>" + convertInline(paragraphBuffer.join(" ")) + "</p>");
            paragraphBuffer = [];
        }
    }
    function closeLists() {
        if (inUl) { html.push("</ul>"); inUl = false; }
        if (inOl) { html.push("</ol>"); inOl = false; }
    }

    for (const line of lines) {
        if (/^```/.test(line.trim())) {
            if (!inCodeBlock) { flushParagraph(); closeLists(); inCodeBlock = true; codeBuffer = []; }
            else { html.push("<pre><code>" + escapeHtml(codeBuffer.join("\n")) + "</code></pre>"); inCodeBlock = false; }
            continue;
        }
        if (inCodeBlock) { codeBuffer.push(line); continue; }

        const trimmed = line.trim();
        if (trimmed === "") { flushParagraph(); closeLists(); continue; }

        const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headerMatch) {
            flushParagraph(); closeLists();
            const level = headerMatch[1].length;
            html.push(`<h${level}>${convertInline(headerMatch[2])}</h${level}>`);
            continue;
        }
        if (/^>\s?/.test(trimmed)) {
            flushParagraph(); closeLists();
            html.push("<blockquote>" + convertInline(trimmed.replace(/^>\s?/, "")) + "</blockquote>");
            continue;
        }
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            flushParagraph(); closeLists();
            html.push("<hr>");
            continue;
        }
        const ulMatch = trimmed.match(/^[-*+]\s+(.*)$/);
        if (ulMatch) {
            flushParagraph();
            if (inOl) { html.push("</ol>"); inOl = false; }
            if (!inUl) { html.push("<ul>"); inUl = true; }
            html.push("<li>" + convertInline(ulMatch[1]) + "</li>");
            continue;
        }
        const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
        if (olMatch) {
            flushParagraph();
            if (inUl) { html.push("</ul>"); inUl = false; }
            if (!inOl) { html.push("<ol>"); inOl = true; }
            html.push("<li>" + convertInline(olMatch[1]) + "</li>");
            continue;
        }
        closeLists();
        paragraphBuffer.push(trimmed);
    }
    flushParagraph(); closeLists();
    if (inCodeBlock && codeBuffer.length) {
        html.push("<pre><code>" + escapeHtml(codeBuffer.join("\n")) + "</code></pre>");
    }
    return html.join("\n");
}

function update() {
    const html = markdownToHtml(markdownInput.value);
    htmlOutput.textContent = html;
    preview.innerHTML = html;
}

markdownInput.addEventListener("input", update);
clearBtn.addEventListener("click", () => { markdownInput.value = ""; update(); markdownInput.focus(); });

markdownInput.value = "# Hello World\n\nThis is **bold**, *italic*, and `inline code`.\n\n- Item one\n- Item two\n\n1. First\n2. Second\n\n> A quote\n\n[A link](https://example.com)";
update();