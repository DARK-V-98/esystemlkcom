import type { ToolArticleData } from "@/components/tools/ToolArticle";

/**
 * Original long-form content for each free tool. Written to give every tool
 * page genuine editorial value (how it works, how to use it, real use cases,
 * tips and FAQs) instead of a bare widget.
 */
export const TOOL_ARTICLES: Record<string, ToolArticleData> = {
  base64: {
    intro: [
      "Base64 is a way of representing binary data — like an image, a PDF or raw bytes — using only 64 plain text characters (A–Z, a–z, 0–9, + and /). Systems that were built to move text around safely, such as email, JSON APIs and HTML data URLs, can't always carry raw binary without it getting corrupted. Encoding to Base64 turns that binary into a text string that survives the trip, and decoding turns it back.",
      "This tool encodes and decodes both plain text and whole files directly in your browser. Your input is never uploaded to a server — the conversion happens locally in JavaScript using the browser's own encoding functions, so even sensitive text stays on your machine.",
    ],
    howTo: [
      "Choose the Text tab to convert a string, or the File → Base64 tab to convert a file into a data URL.",
      "For text: paste or type your content into the input box.",
      "Click Encode to Base64 to convert plain text into a Base64 string, or Decode from Base64 to turn a Base64 string back into readable text.",
      "For files: select any image, PDF or document and the tool produces a Base64 data URL you can paste straight into HTML or CSS.",
      "Click Copy to put the result on your clipboard.",
    ],
    useCases: [
      "Embedding a small image or icon directly inside HTML or CSS as a data URL, avoiding an extra network request.",
      "Sending binary attachments through JSON APIs or webhooks that only accept text fields.",
      "Storing a logo or signature inside a configuration file or database column.",
      "Decoding a Base64 string from a JWT, an email header or an API response to read what it contains.",
      "Quickly inspecting or debugging encoded values while developing.",
    ],
    tips: [
      "Base64 is encoding, not encryption — anyone can decode it. Never use it to hide passwords or secrets. For that, use the File Encrypt tool instead.",
      "Base64 makes data roughly 33% larger, so it's best for small assets. Large images are usually better served as real files.",
      "If decoding fails, check that the whole string was copied — a single missing character breaks the result.",
    ],
    faq: [
      {
        q: "Is my data uploaded anywhere?",
        a: "No. Both text and file conversion run entirely in your browser using local JavaScript. Nothing is sent to a server.",
      },
      {
        q: "Can I convert an image to Base64?",
        a: "Yes. Use the File → Base64 tab, select the image, and you'll get a data URL you can paste directly into HTML or CSS.",
      },
      {
        q: "Is Base64 secure for passwords?",
        a: "No. Base64 is reversible by anyone and offers no security. Use real encryption for anything sensitive.",
      },
    ],
  },

  "hash-generator": {
    intro: [
      "A hash is a fixed-length fingerprint of any piece of data. Feed in a word, a paragraph or an entire file and a hashing algorithm like SHA-256 or SHA-512 produces a unique string of hexadecimal characters. Change even a single letter and the resulting hash looks completely different, which makes hashes ideal for verifying that data hasn't been altered.",
      "This generator computes SHA-256 and SHA-512 hashes for both text and files using the browser's built-in Web Crypto API. Everything is calculated locally, so your text and files never leave your device.",
    ],
    howTo: [
      "Pick whether you want to hash text or a file.",
      "For text, type or paste your content into the input area.",
      "For a file, select it from your device — it's read locally, never uploaded.",
      "Generate the hashes: SHA-1, SHA-256, SHA-384 and SHA-512 are all calculated and shown side by side.",
      "Copy the algorithm you need to compare it against a known value.",
    ],
    useCases: [
      "Verifying a downloaded file matches the checksum published by its author.",
      "Checking whether two files are identical without opening them.",
      "Generating a stable, unique key from a piece of content.",
      "Confirming that data transferred between systems arrived unchanged.",
      "Learning how hashing works while studying security or cryptography.",
    ],
    tips: [
      "A matching hash proves two inputs are identical; a different hash proves they are not.",
      "Hashing is one-way — you can't turn a hash back into the original data, which is exactly the point.",
      "For password storage in real applications, use a purpose-built algorithm like bcrypt or Argon2 rather than a plain SHA hash.",
    ],
    faq: [
      {
        q: "What's the difference between SHA-256 and SHA-512?",
        a: "Both are secure. SHA-512 produces a longer 128-character digest and can be faster on 64-bit systems; SHA-256 produces a 64-character digest and is the most widely used.",
      },
      {
        q: "Can I hash large files?",
        a: "Yes, though very large files depend on your device's memory since the file is read locally in the browser.",
      },
      {
        q: "Does the tool store my input?",
        a: "No. Hashes are computed in your browser with the Web Crypto API and nothing is uploaded.",
      },
    ],
  },

  "password-generator": {
    intro: [
      "Weak, reused passwords are the single most common cause of account breaches. A strong password is long, random and unique to each account — which is exactly what this generator creates. It uses the browser's cryptographically secure random number generator, not a predictable pseudo-random shortcut, so every password is genuinely hard to guess.",
      "You control the length and which character types to include: uppercase, lowercase, numbers and symbols. The password is generated on your device and is never transmitted or logged anywhere.",
    ],
    howTo: [
      "Set the desired password length — 16 characters or more is recommended for important accounts.",
      "Toggle which character types to include: uppercase, lowercase, numbers and symbols.",
      "Generate a password; click again to get a fresh one until you're happy.",
      "Copy the password to your clipboard.",
      "Paste it into your password manager or the account's password field, then store it safely.",
    ],
    useCases: [
      "Creating a unique password for a new online account.",
      "Replacing a weak or reused password after a breach notification.",
      "Generating Wi-Fi passphrases or device PINs.",
      "Producing random API keys or seed values for testing.",
      "Setting strong passwords for family members or team members.",
    ],
    tips: [
      "Use a different password for every account — a password manager makes this effortless.",
      "Longer beats complex: a 20-character password is far stronger than a short one full of symbols.",
      "Enable two-factor authentication wherever it's offered for an extra layer of protection.",
    ],
    faq: [
      {
        q: "Are the passwords really random?",
        a: "Yes. They're generated with the browser's crypto.getRandomValues, a cryptographically secure source, not a simple predictable random function.",
      },
      {
        q: "Is the generated password sent anywhere?",
        a: "No. Generation happens entirely in your browser and nothing is stored, logged or transmitted.",
      },
      {
        q: "How long should my password be?",
        a: "At least 16 characters for important accounts. Longer is stronger, so go higher when the site allows it.",
      },
    ],
  },

  "qr-generator": {
    intro: [
      "A QR code is a square barcode that a phone camera can read instantly, turning a scan into an action — opening a website, sharing contact details, joining Wi-Fi or displaying text. They bridge the gap between the physical world and the digital one, which is why you see them on posters, menus, packaging and business cards.",
      "This generator turns any URL or text into a clean, high-resolution QR code that you can download as a PNG and use anywhere. The code is drawn in your browser, so whatever you encode stays on your device.",
    ],
    howTo: [
      "Type or paste the URL or text you want the QR code to contain.",
      "The QR code updates instantly as you type.",
      "Check the preview and, if you like, test it by scanning with your phone.",
      "Download the QR code as a PNG image.",
      "Place it on your website, print material, packaging or slides.",
    ],
    useCases: [
      "Linking a printed poster, flyer or business card to your website.",
      "Putting a menu, price list or booking page on a restaurant table.",
      "Sharing your contact details or social profiles at an event.",
      "Adding a quick review or feedback link to a receipt or package.",
      "Displaying a payment or donation link that people can scan and pay.",
    ],
    tips: [
      "Keep the encoded URL short so the code stays simple and scans reliably from a distance.",
      "Always test-scan the downloaded image before printing it at scale.",
      "Leave a clear white margin (quiet zone) around the code so cameras can lock onto it.",
    ],
    faq: [
      {
        q: "Do these QR codes expire?",
        a: "No. The code is static — it encodes your URL or text directly, so it works forever as long as the destination link stays live.",
      },
      {
        q: "Can I use the QR code commercially?",
        a: "Yes. The generated PNG is yours to use on printed material, products and websites without restriction.",
      },
      {
        q: "Is my link tracked?",
        a: "No. The code is generated locally in your browser and we don't record or track what you encode.",
      },
    ],
  },

  "word-counter": {
    intro: [
      "Whether you're writing an essay with a strict limit, a meta description that must fit in 160 characters, or a social post with a character cap, knowing your counts as you write saves a lot of editing later. This word counter gives you live word, character, sentence and paragraph counts plus an estimated reading time the moment you start typing.",
      "All counting happens in your browser as you type — nothing you write is uploaded, saved or seen by anyone else, so it's safe for drafts and confidential text.",
    ],
    howTo: [
      "Type directly into the box or paste text you've already written.",
      "Watch the word and character counts update live with every keystroke.",
      "Check the sentence and paragraph totals to gauge structure.",
      "Use the estimated reading time to judge how long your piece takes to read.",
      "Edit until your counts fit the limit you're aiming for.",
    ],
    useCases: [
      "Staying within an essay, assignment or application word limit.",
      "Trimming a meta title or description to the length search engines display.",
      "Fitting a post inside a social media character cap.",
      "Estimating how long an article will take readers to get through.",
      "Checking the length of ad copy, captions or product descriptions.",
    ],
    tips: [
      "Reading time assumes an average pace of around 200 words per minute — adjust expectations for technical writing.",
      "Character counts include spaces, which matters for platforms that count every character.",
      "Paste as plain text to avoid hidden formatting affecting your counts.",
    ],
    faq: [
      {
        q: "Does it count characters with or without spaces?",
        a: "It shows character counts including spaces, which is what most platforms with a character limit measure.",
      },
      {
        q: "Is my text saved or uploaded?",
        a: "No. Counting happens live in your browser and nothing you type is stored or transmitted.",
      },
      {
        q: "How is reading time calculated?",
        a: "It's based on your word count at an average reading speed of roughly 200 words per minute.",
      },
    ],
  },

  "image-cropper": {
    intro: [
      "Cropping removes the parts of an image you don't need so the subject fills the frame — essential for profile pictures, thumbnails and product shots. This cropper lets you cut an image to a free rectangle or a perfect circle and download the result as a PNG, all inside your browser.",
      "Because the whole process runs locally, your photos are never uploaded to a server. That makes it safe for personal pictures, ID photos and anything you'd rather not send to a third party.",
    ],
    howTo: [
      "Upload the image you want to crop from your device.",
      "Drag to position and resize the crop area over the part you want to keep.",
      "Choose a circular crop if you need a round avatar, or leave it rectangular.",
      "Preview the result to make sure the framing is right.",
      "Download the cropped image as a PNG.",
    ],
    useCases: [
      "Making a round profile picture for social media or a website.",
      "Cropping product photos to a consistent frame for a store.",
      "Removing unwanted background or edges from a screenshot.",
      "Cutting a headshot down to just the face for an ID or badge.",
      "Preparing square thumbnails for a blog or video.",
    ],
    tips: [
      "Circular crops export with a transparent background as PNG, so they sit cleanly on any color.",
      "Crop to the aspect ratio your destination needs (square for most avatars) to avoid awkward stretching later.",
      "Start from the highest-resolution version of your image so the crop stays sharp.",
    ],
    faq: [
      {
        q: "Are my images uploaded?",
        a: "No. Cropping happens entirely in your browser and your image never leaves your device.",
      },
      {
        q: "Can I crop to a circle?",
        a: "Yes. Choose the circular option and the exported PNG will have a transparent background outside the circle.",
      },
      {
        q: "What format is the download?",
        a: "Cropped images are saved as PNG, which preserves quality and supports transparency.",
      },
    ],
  },

  "image-compressor": {
    intro: [
      "Large image files slow down websites, fill up storage and bounce back from email attachment limits. Compression shrinks the file size by removing data the eye barely notices, so your images load faster while still looking good. This tool compresses images right in your browser and lets you download the smaller version.",
      "Nothing is uploaded — the compression is done locally, so even private or unpublished images stay on your device.",
    ],
    howTo: [
      "Upload the image you want to shrink.",
      "Adjust the quality or compression level to balance size against sharpness.",
      "Compare the original and compressed file sizes.",
      "Preview the result to check the quality is still acceptable.",
      "Download the compressed image.",
    ],
    useCases: [
      "Speeding up a website by serving lighter images.",
      "Getting a photo under an email or upload size limit.",
      "Reducing the storage a photo library takes up.",
      "Preparing images for a faster-loading online store.",
      "Sharing pictures over slow connections without long waits.",
    ],
    tips: [
      "Aim for the smallest size where the image still looks good — the last bit of quality often isn't worth the extra kilobytes.",
      "Photographs compress far more than flat graphics or text-heavy images.",
      "Resize oversized images to the dimensions you actually display before compressing for the biggest savings.",
    ],
    faq: [
      {
        q: "Will compression ruin my image quality?",
        a: "Not if you choose a sensible level. You can preview the result and dial the quality up or down until you're happy.",
      },
      {
        q: "Is my image uploaded to a server?",
        a: "No. Compression runs locally in your browser and your image is never transmitted.",
      },
      {
        q: "How much smaller will the file be?",
        a: "It depends on the image, but photos often shrink by 50–80% with little visible change.",
      },
    ],
  },

  "image-resizer": {
    intro: [
      "Sometimes an image is simply the wrong size — too big for a profile photo, too small for a banner, or not the exact pixel dimensions a platform demands. This resizer lets you set precise width and height in pixels and download the resized image, all in your browser.",
      "The resizing is done locally, so your images are never uploaded. That keeps personal photos and work-in-progress designs private.",
    ],
    howTo: [
      "Upload the image you want to resize.",
      "Enter the target width and height in pixels.",
      "Keep the aspect ratio locked to avoid stretching, or unlock it for an exact fit.",
      "Preview the resized image.",
      "Download the result to your device.",
    ],
    useCases: [
      "Meeting the exact dimensions a website or app requires for uploads.",
      "Scaling a photo down for faster loading.",
      "Preparing a banner, header or thumbnail at a specific size.",
      "Standardizing a batch of images to the same dimensions.",
      "Fitting an image into a template or layout without distortion.",
    ],
    tips: [
      "Keep the aspect ratio locked unless you specifically need a stretched result.",
      "Scaling down keeps images crisp; scaling far beyond the original size can look soft.",
      "Note the dimensions your destination needs before you start so you only resize once.",
    ],
    faq: [
      {
        q: "Will resizing distort my image?",
        a: "Only if you turn off the aspect-ratio lock and enter mismatched dimensions. Keep it locked to scale proportionally.",
      },
      {
        q: "Can I make an image larger?",
        a: "Yes, but enlarging beyond the original resolution can reduce sharpness since there's no extra detail to add.",
      },
      {
        q: "Is the image uploaded anywhere?",
        a: "No. Resizing happens entirely in your browser and your image stays on your device.",
      },
    ],
  },

  "pdf-watermark": {
    intro: [
      "A watermark is text laid across a document to mark ownership, status or confidentiality — think 'DRAFT', 'CONFIDENTIAL' or a company name. Adding one deters unauthorised reuse and makes the purpose of a document obvious at a glance. This tool stamps a custom text watermark across every page of a PDF and lets you download the marked copy.",
      "The PDF is processed in your browser, so your document is never uploaded. That's important for contracts, reports and anything sensitive you'd rather not send to an online service.",
    ],
    howTo: [
      "Upload the PDF you want to watermark.",
      "Type the watermark text, such as your company name or a status label.",
      "Adjust the appearance — position, angle or opacity — if the tool offers those options.",
      "Preview how the watermark sits on the pages.",
      "Download the watermarked PDF.",
    ],
    useCases: [
      "Marking a document as DRAFT or CONFIDENTIAL before sharing it.",
      "Adding your brand name across a proposal, quote or report.",
      "Protecting sample or preview documents from being passed off as final.",
      "Labelling copies with a client name to discourage redistribution.",
      "Signalling a document's version or approval status.",
    ],
    tips: [
      "Lighter, semi-transparent watermarks stay readable without hiding the underlying text.",
      "A diagonal watermark is harder to crop out than one sitting in a corner.",
      "Keep an unwatermarked master copy so you can regenerate marks later.",
    ],
    faq: [
      {
        q: "Is my PDF uploaded to a server?",
        a: "No. The watermark is applied in your browser and your document never leaves your device.",
      },
      {
        q: "Does it watermark every page?",
        a: "Yes. The text is applied across all pages of the PDF you upload.",
      },
      {
        q: "Can I remove the watermark later?",
        a: "The download is a new, watermarked file. Keep your original PDF if you need a clean copy.",
      },
    ],
  },

  "file-encrypt": {
    intro: [
      "Encryption scrambles a file so that only someone with the correct password can read it. This tool uses AES-256 — the same standard trusted by governments and banks — to encrypt or decrypt any file with a password you choose. Without that password, the encrypted file is meaningless, even to us.",
      "Everything happens in your browser and works offline: the file and password never leave your device. That means you can protect a document before emailing it, or safely decrypt one you've received, without trusting any server.",
    ],
    howTo: [
      "Select the file you want to encrypt or decrypt.",
      "Choose Encrypt to protect a file, or Decrypt to unlock one.",
      "Enter a strong password — and remember it, because it cannot be recovered.",
      "Run the operation; the tool produces the encrypted or decrypted file.",
      "Download the result and share the password separately from the file.",
    ],
    useCases: [
      "Protecting a sensitive document before sending it by email.",
      "Storing personal files securely on a shared or cloud drive.",
      "Sharing confidential data with a colleague who has the password.",
      "Keeping backups of important files locked down.",
      "Decrypting a file someone has sent you securely.",
    ],
    tips: [
      "There is no password recovery — if you forget the password, the file cannot be opened. Store it safely.",
      "Send the password through a different channel than the file (for example, text the password if you emailed the file).",
      "Use a long, unique password; the Password Generator tool can create one for you.",
    ],
    faq: [
      {
        q: "What encryption does it use?",
        a: "AES-256, a widely trusted, industry-standard symmetric encryption algorithm.",
      },
      {
        q: "Can you recover my file if I forget the password?",
        a: "No. Encryption and decryption happen entirely on your device and we never see your file or password, so a lost password means the file can't be opened.",
      },
      {
        q: "Does it work offline?",
        a: "Yes. Once the page has loaded, encryption and decryption run locally and need no internet connection.",
      },
    ],
  },

  "json-formatter": {
    intro: [
      "JSON (JavaScript Object Notation) is the format APIs, config files and databases use to exchange data. But raw JSON is often delivered as one long, unreadable line. A formatter re-indents it into a clean, nested structure so you can actually read it, and a validator catches the missing comma or bracket that's breaking your code.",
      "This tool formats, beautifies and validates JSON entirely in your browser. Paste in a messy blob and get back neatly indented output, or minify it back down to a single line. Nothing is uploaded, so it's safe to paste API responses containing private data.",
    ],
    howTo: [
      "Paste your JSON into the input box.",
      "Click Format to indent and beautify it, or Minify to strip whitespace.",
      "If the JSON is invalid, the tool points out where the error is so you can fix it.",
      "Adjust the indentation to 2 or 4 spaces to match your project's style.",
      "Copy the cleaned-up result to your clipboard.",
    ],
    useCases: [
      "Reading an API response that arrived as one unreadable line.",
      "Finding the syntax error in a config file that won't parse.",
      "Minifying JSON to reduce payload size before shipping.",
      "Tidying up data before pasting it into documentation or a ticket.",
      "Learning JSON structure while studying web development.",
    ],
    tips: [
      "Valid JSON uses double quotes around keys and strings — single quotes will fail.",
      "Trailing commas after the last item are not allowed in strict JSON.",
      "Minify for production payloads, but keep a formatted copy for humans to read.",
    ],
    faq: [
      {
        q: "Is my JSON sent to a server?",
        a: "No. Formatting and validation run entirely in your browser, so even sensitive API data stays on your device.",
      },
      {
        q: "Why does it say my JSON is invalid?",
        a: "Common causes are single quotes, trailing commas, or a missing bracket. The tool highlights where parsing failed so you can fix it.",
      },
      {
        q: "Can it minify as well as beautify?",
        a: "Yes. Format expands JSON for readability; Minify collapses it to the smallest valid single-line form.",
      },
    ],
  },

  "url-encoder": {
    intro: [
      "URLs can only safely contain a limited set of characters. Spaces, ampersands, question marks, slashes and non-English letters have to be percent-encoded (for example, a space becomes %20) so they don't break the link or get misread by a server. URL encoding converts those characters into a safe form, and decoding turns them back into readable text.",
      "This tool encodes and decodes URLs and query-string values instantly in your browser using the standard encodeURIComponent and decodeURIComponent functions. Nothing is uploaded.",
    ],
    howTo: [
      "Paste the text or URL you want to convert into the input box.",
      "Click Encode to make it URL-safe, or Decode to turn an encoded string back into plain text.",
      "Use component encoding for individual query values and full-URL encoding for whole links.",
      "Check the output for the converted result.",
      "Copy it to use in your link, API request or code.",
    ],
    useCases: [
      "Building a query string with values that contain spaces or symbols.",
      "Decoding a messy tracking link to see the real destination and parameters.",
      "Passing text safely inside a URL parameter in an API call.",
      "Debugging why a link with special characters isn't working.",
      "Encoding non-English text so it survives being placed in a URL.",
    ],
    tips: [
      "Use component encoding (encodeURIComponent) for individual values — it escapes &, = and ? which full-URL encoding leaves alone.",
      "Never put passwords or sensitive data in a URL, even encoded — URLs get logged.",
      "Double-encoding is a common bug: encode a value once, not twice.",
    ],
    faq: [
      {
        q: "What's the difference between encode and encode component?",
        a: "Component encoding escapes reserved characters like & = ? for use inside a single value, while full-URL encoding preserves those so the overall link structure stays intact.",
      },
      {
        q: "Is my input uploaded?",
        a: "No. Encoding and decoding happen locally in your browser.",
      },
      {
        q: "Why does a space become %20 or +?",
        a: "In URL paths a space is encoded as %20; in form query strings it can appear as +. Both decode back to a space.",
      },
    ],
  },

  "uuid-generator": {
    intro: [
      "A UUID (Universally Unique Identifier) is a 128-bit value, usually shown as 36 characters like 550e8400-e29b-41d4-a716-446655440000. Because they're generated from huge random space, two UUIDs practically never collide — which makes them perfect for database keys, request IDs and file names that must be unique without a central counter.",
      "This generator creates version 4 (random) UUIDs using the browser's cryptographically secure random source. Generate one or many at once and copy them instantly. Everything runs locally.",
    ],
    howTo: [
      "Choose how many UUIDs you want to generate.",
      "Click Generate to create them.",
      "Copy a single UUID, or copy the whole list at once.",
      "Generate again any time you need fresh values.",
      "Paste them into your database, code or test data.",
    ],
    useCases: [
      "Creating unique primary keys for database records.",
      "Generating request or correlation IDs for logging and tracing.",
      "Naming uploaded files so they never clash.",
      "Producing unique tokens or identifiers in test data.",
      "Assigning stable IDs to items in a distributed system.",
    ],
    tips: [
      "Version 4 UUIDs are random — great for uniqueness, but not sortable by time.",
      "UUIDs are not secret; anyone can generate valid-looking ones, so don't use them as security tokens on their own.",
      "Store UUIDs as a dedicated type or fixed-length column for efficiency.",
    ],
    faq: [
      {
        q: "Are these UUIDs really unique?",
        a: "Version 4 UUIDs are drawn from such a large random space that collisions are astronomically unlikely, so they're treated as unique in practice.",
      },
      {
        q: "Which UUID version does it generate?",
        a: "Version 4 (randomly generated), the most common type for keys and identifiers.",
      },
      {
        q: "Is generation done on a server?",
        a: "No. UUIDs are generated in your browser using a secure random source and nothing is sent anywhere.",
      },
    ],
  },

  "timestamp-converter": {
    intro: [
      "A Unix timestamp is the number of seconds (or milliseconds) since 1 January 1970 UTC — the way computers and APIs almost always store time. It's compact and timezone-free, but impossible for a human to read at a glance. This converter translates between Unix timestamps and normal, readable dates in both directions.",
      "Enter a timestamp to see the human date, or pick a date to get the timestamp. Conversions happen instantly in your browser, with both UTC and your local time shown.",
    ],
    howTo: [
      "To read a timestamp, paste the Unix value into the input.",
      "The tool shows the matching date and time in both UTC and your local timezone.",
      "To go the other way, enter a human date and get its Unix timestamp.",
      "Switch between seconds and milliseconds depending on what your system uses.",
      "Copy the result into your code, database query or log analysis.",
    ],
    useCases: [
      "Turning a timestamp from a log file or API response into a readable date.",
      "Getting the Unix value for a specific date to use in a query.",
      "Debugging time-related bugs by checking exactly when an event happened.",
      "Converting between UTC and local time for scheduling.",
      "Checking token or cache expiry times stored as timestamps.",
    ],
    tips: [
      "Watch the units: JavaScript uses milliseconds, most backends use seconds — a 1000x difference.",
      "Unix timestamps are always in UTC; apply a timezone offset only when displaying to users.",
      "The current timestamp is handy for setting created-at or expiry values.",
    ],
    faq: [
      {
        q: "Seconds or milliseconds?",
        a: "Both are supported. Unix timestamps are classically in seconds, but JavaScript and some APIs use milliseconds (1000x larger). The tool lets you switch.",
      },
      {
        q: "Does it handle timezones?",
        a: "Yes. Timestamps are UTC-based, and the tool shows both UTC and your local time when converting.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. All conversions run locally in your browser.",
      },
    ],
  },

  "case-converter": {
    intro: [
      "Retyping text just to change its capitalisation is a waste of time — and error-prone. A case converter instantly transforms any text between UPPERCASE, lowercase, Title Case, Sentence case and developer formats like camelCase, snake_case and kebab-case, without you touching a single letter.",
      "Paste your text, pick a case, and copy the result. The conversion happens live in your browser, so nothing you paste is stored or uploaded.",
    ],
    howTo: [
      "Paste or type your text into the box.",
      "Choose the case you want: UPPER, lower, Title, Sentence, camelCase, snake_case or kebab-case.",
      "The converted text appears instantly.",
      "Review it and make any manual tweaks.",
      "Copy the result to your clipboard.",
    ],
    useCases: [
      "Fixing text accidentally typed with Caps Lock on.",
      "Formatting a heading or title into proper Title Case.",
      "Converting a label into snake_case or camelCase for code.",
      "Turning a phrase into a kebab-case slug for a URL or CSS class.",
      "Standardising the capitalisation of a list or spreadsheet column.",
    ],
    tips: [
      "Title Case keeps small words like 'and' or 'of' lowercase in many style guides — check yours.",
      "camelCase and snake_case are ideal for variable and function names.",
      "Sentence case only capitalises the first letter, which is handy for body text.",
    ],
    faq: [
      {
        q: "What cases are supported?",
        a: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and kebab-case.",
      },
      {
        q: "Is my text stored?",
        a: "No. Conversion runs live in your browser and nothing is saved or uploaded.",
      },
      {
        q: "Can it handle long documents?",
        a: "Yes. There's no length limit beyond what your browser can comfortably hold in memory.",
      },
    ],
  },

  "lorem-ipsum": {
    intro: [
      "Lorem Ipsum is placeholder text designers and developers use to fill a layout before the real copy is ready. Because it looks like natural language but carries no meaning, it lets you judge spacing, typography and flow without being distracted by the words themselves.",
      "This generator produces as many paragraphs, sentences or words of Lorem Ipsum as you need, instantly and in your browser. Copy it straight into your mockup, template or design.",
    ],
    howTo: [
      "Choose whether you want paragraphs, sentences or words.",
      "Set how many you need.",
      "Generate the placeholder text.",
      "Optionally start with the classic 'Lorem ipsum dolor sit amet…' opening.",
      "Copy the result into your design or document.",
    ],
    useCases: [
      "Filling a website mockup before the final copy arrives.",
      "Testing how a layout handles different amounts of text.",
      "Populating a template, theme or component demo.",
      "Checking font, line-height and spacing choices.",
      "Creating dummy content for a presentation or prototype.",
    ],
    tips: [
      "Generate slightly more text than you think you need so you can test overflow.",
      "Swap placeholder text for real copy before launch — Lorem Ipsum left live looks unprofessional.",
      "Use realistic paragraph counts to preview how a real article will sit.",
    ],
    faq: [
      {
        q: "Can I choose paragraphs, sentences or words?",
        a: "Yes. Pick the unit and the quantity, and the generator produces exactly that much placeholder text.",
      },
      {
        q: "Does it start with 'Lorem ipsum'?",
        a: "You can choose to begin with the traditional opening line or generate fresh randomised text.",
      },
      {
        q: "Is it free to use commercially?",
        a: "Yes. Placeholder text has no restrictions — use it in any project.",
      },
    ],
  },

  "slug-generator": {
    intro: [
      "A slug is the readable part of a URL that identifies a page, like 'best-coffee-in-colombo' in a blog post address. Good slugs are lowercase, use hyphens instead of spaces, and strip out accents and punctuation, which makes them clean, shareable and better for SEO.",
      "This generator turns any title or phrase into a URL-friendly slug instantly. It lowercases the text, replaces spaces with hyphens, removes special characters and handles accented letters — all in your browser.",
    ],
    howTo: [
      "Type or paste your title or phrase.",
      "The slug is generated automatically as you type.",
      "Choose a separator if you prefer underscores over hyphens.",
      "Check the result reads cleanly and describes the page.",
      "Copy the slug into your CMS, code or URL.",
    ],
    useCases: [
      "Creating clean URLs for blog posts and articles.",
      "Generating stable identifiers for products or categories.",
      "Making CSS class names or file names from a label.",
      "Producing anchor IDs for on-page links.",
      "Standardising URLs across a large site.",
    ],
    tips: [
      "Keep slugs short and descriptive — a few meaningful words beat a long sentence.",
      "Include your main keyword in the slug for a small SEO boost.",
      "Once a page is published, avoid changing its slug or set up a redirect to preserve links.",
    ],
    faq: [
      {
        q: "Does it handle accented characters?",
        a: "Yes. Accented letters are converted to their plain equivalents so the slug stays clean and URL-safe.",
      },
      {
        q: "Can I use underscores instead of hyphens?",
        a: "Yes, though hyphens are the SEO-recommended separator for URLs.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. The slug is generated locally in your browser.",
      },
    ],
  },

  "text-diff": {
    intro: [
      "When two versions of a document look almost identical, spotting what changed by eye is slow and unreliable. A diff checker compares two blocks of text and highlights exactly what was added, removed or changed between them, so you can review edits in seconds.",
      "Paste an original and a revised version, and this tool shows the differences instantly in your browser. Nothing is uploaded, so it's safe for contracts, code and private documents.",
    ],
    howTo: [
      "Paste the original text into the first box.",
      "Paste the changed version into the second box.",
      "Run the comparison.",
      "Review the highlighted additions and deletions.",
      "Use the result to confirm or roll back changes.",
    ],
    useCases: [
      "Checking what changed between two drafts of a document.",
      "Reviewing edits someone made to your text.",
      "Comparing two versions of a code snippet or config.",
      "Verifying a copy-paste didn't drop or alter anything.",
      "Spotting subtle differences in near-identical text.",
    ],
    tips: [
      "Compare like with like — paste plain text rather than mixing formatted and unformatted versions.",
      "For long documents, compare section by section to keep the diff readable.",
      "Additions and deletions are colour-coded so you can scan changes quickly.",
    ],
    faq: [
      {
        q: "Is my text sent anywhere?",
        a: "No. The comparison runs entirely in your browser, so even confidential documents stay private.",
      },
      {
        q: "Does it compare word by word or line by line?",
        a: "It highlights the differences between the two texts so you can clearly see what was added and removed.",
      },
      {
        q: "Can I compare code?",
        a: "Yes. It works with any plain text, including code snippets and configuration files.",
      },
    ],
  },

  "percentage-calculator": {
    intro: [
      "Percentages come up constantly — a discount at the shop, a tip at a restaurant, VAT on an invoice, or how much a price went up since last year. But the mental arithmetic trips most people up. This calculator handles the common percentage questions for you, clearly and instantly.",
      "Work out what percent one number is of another, find a percentage of a value, or calculate the percentage increase or decrease between two numbers. Everything is computed live in your browser.",
    ],
    howTo: [
      "Choose the type of calculation you need.",
      "To find a percentage of a number, enter the percentage and the value.",
      "To find what percent one number is of another, enter both numbers.",
      "To find a change, enter the original and new values for the increase or decrease.",
      "Read the result instantly — no need to press calculate.",
    ],
    useCases: [
      "Working out a discount or sale price in a shop.",
      "Calculating a tip or splitting a bill by percentage.",
      "Adding or removing VAT or sales tax from a price.",
      "Measuring how much a value grew or shrank over time.",
      "Checking a test score or completion percentage.",
    ],
    tips: [
      "A percentage increase and the equal-sized decrease don't cancel out — going up 50% then down 50% leaves you lower than you started.",
      "To remove a tax that was added, divide by 1 plus the rate, don't just subtract the percentage.",
      "Percentages over 100% are perfectly valid — they just mean more than the whole.",
    ],
    faq: [
      {
        q: "What calculations can it do?",
        a: "Finding a percentage of a number, what percent one number is of another, and the percentage increase or decrease between two values.",
      },
      {
        q: "Does it handle percentage change?",
        a: "Yes. Enter an original and a new value and it shows the increase or decrease as a percentage.",
      },
      {
        q: "Is my data uploaded?",
        a: "No. All calculations run locally in your browser.",
      },
    ],
  },

  "age-calculator": {
    intro: [
      "How old are you exactly — not just in years, but months and days? An age calculator works out the precise time between a birth date and today (or any date you choose), which is useful for forms, eligibility checks, milestones and simple curiosity.",
      "Enter a date of birth and the tool instantly shows the age in years, months and days, plus the total days lived. The calculation runs entirely in your browser and no personal data is stored.",
    ],
    howTo: [
      "Enter the date of birth.",
      "Optionally change the 'age at' date if you want the age on a different day.",
      "Read the exact age in years, months and days.",
      "Check the total number of days if you need it.",
      "Use it for forms, eligibility or milestone planning.",
    ],
    useCases: [
      "Filling in an exact age on an official form or application.",
      "Checking whether someone meets an age requirement.",
      "Counting down to a birthday or milestone.",
      "Working out a child's age in months for health records.",
      "Calculating the age difference between two people.",
    ],
    tips: [
      "Leap years are handled automatically, so the day count stays accurate.",
      "Set the 'age at' date to a future date to see how old someone will be then.",
      "Total days lived is a fun stat — and useful for precise medical or legal contexts.",
    ],
    faq: [
      {
        q: "Does it account for leap years?",
        a: "Yes. The calculation uses real calendar dates, so leap years and varying month lengths are handled correctly.",
      },
      {
        q: "Can I calculate age on a past or future date?",
        a: "Yes. Change the second date to any day to see the age as of that date.",
      },
      {
        q: "Is my birth date stored?",
        a: "No. The calculation runs in your browser and nothing is saved or uploaded.",
      },
    ],
  },

  "bmi-calculator": {
    intro: [
      "Body Mass Index (BMI) is a simple screening number that relates your weight to your height. It's widely used as a quick, rough guide to whether someone is in a healthy weight range for their height, and it places the result into categories from underweight to obese.",
      "Enter your height and weight in metric or imperial units and this calculator shows your BMI and its category instantly, in your browser. BMI is a general indicator, not a diagnosis — see the note below.",
    ],
    howTo: [
      "Choose metric (cm, kg) or imperial (ft/in, lb) units.",
      "Enter your height.",
      "Enter your weight.",
      "Read your BMI value and which category it falls into.",
      "Use it as a rough guide and talk to a professional for real advice.",
    ],
    useCases: [
      "Getting a quick sense of your weight status relative to your height.",
      "Tracking BMI over time as part of a fitness goal.",
      "Understanding where a BMI figure sits on the standard scale.",
      "Comparing metric and imperial measurements.",
      "Preparing information before a health check-up.",
    ],
    tips: [
      "BMI doesn't distinguish muscle from fat, so very athletic people can read as 'overweight' while being healthy.",
      "It's a population-level screening tool, not a diagnosis — always consult a doctor for personal advice.",
      "BMI categories are for adults; children and teens use age- and sex-specific charts.",
    ],
    faq: [
      {
        q: "How is BMI calculated?",
        a: "BMI is your weight in kilograms divided by the square of your height in metres. The calculator handles the maths and unit conversions for you.",
      },
      {
        q: "Is BMI accurate for everyone?",
        a: "No. It's a rough screening tool that ignores muscle mass, body composition and age, so treat it as a general guide only.",
      },
      {
        q: "Is my health data stored?",
        a: "No. The calculation runs in your browser and nothing is saved or uploaded.",
      },
    ],
  },

  "loan-calculator": {
    intro: [
      "Before taking a loan — a mortgage, car loan or personal loan — it helps to know exactly what the monthly repayment will be and how much interest you'll pay over the full term. This loan (EMI) calculator works that out from the amount, interest rate and term.",
      "Enter the loan amount, annual interest rate and number of years, and the calculator shows your fixed monthly payment (EMI), the total interest, and the total amount repaid. It all runs in your browser.",
    ],
    howTo: [
      "Enter the loan amount you want to borrow.",
      "Enter the annual interest rate as a percentage.",
      "Enter the loan term in years (or months).",
      "Read the monthly payment, total interest and total repayment.",
      "Adjust the numbers to compare different scenarios.",
    ],
    useCases: [
      "Estimating the monthly repayment on a home or car loan.",
      "Comparing loan offers with different rates or terms.",
      "Seeing how a bigger deposit lowers your monthly payment.",
      "Understanding how much of a loan is interest versus principal.",
      "Budgeting before committing to borrowing.",
    ],
    tips: [
      "A longer term lowers the monthly payment but increases the total interest you pay.",
      "Even a small difference in interest rate adds up significantly over a long loan.",
      "This is an estimate — actual offers may include fees, insurance or a different compounding method.",
    ],
    faq: [
      {
        q: "What is EMI?",
        a: "EMI stands for Equated Monthly Instalment — the fixed amount you pay each month, covering both interest and principal, until the loan is repaid.",
      },
      {
        q: "Does it include fees or insurance?",
        a: "No. It calculates principal and interest only, so real-world offers with fees may differ slightly.",
      },
      {
        q: "Is my financial data uploaded?",
        a: "No. The calculation runs entirely in your browser and nothing is stored.",
      },
    ],
  },

  "color-converter": {
    intro: [
      "The same colour can be written many ways: as a HEX code (#00bfff), as RGB values (0, 191, 255) or as HSL (hue, saturation, lightness). Designers and developers constantly need to move between these formats — a design tool gives you one, but your CSS or code needs another. This converter translates a colour between all three instantly.",
      "Pick a colour with the visual picker or type a value in any format, and see the matching HEX, RGB and HSL at once. Everything runs in your browser.",
    ],
    howTo: [
      "Use the colour picker to choose a colour visually, or type a HEX, RGB or HSL value.",
      "The other formats update automatically to match.",
      "Copy the format you need for your CSS or design tool.",
      "Fine-tune the colour until it's exactly right.",
      "Reuse the values across your project for consistency.",
    ],
    useCases: [
      "Converting a HEX code from a design into RGB or HSL for CSS.",
      "Matching a brand colour across different tools.",
      "Grabbing the exact value of a colour you picked visually.",
      "Adjusting lightness or saturation using HSL.",
      "Building a consistent colour system for a website.",
    ],
    tips: [
      "HSL makes it easy to create lighter or darker shades by changing only the lightness value.",
      "HEX and RGB describe the same colour — use whichever your codebase prefers.",
      "Keep a note of your core brand colours in one format to avoid drift.",
    ],
    faq: [
      {
        q: "Which formats does it convert between?",
        a: "HEX, RGB and HSL — change any one and the others update to match.",
      },
      {
        q: "Can I pick a colour visually?",
        a: "Yes. Use the built-in colour picker, or type a value directly in any supported format.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. All conversion happens locally in your browser.",
      },
    ],
  },

  "gradient-generator": {
    intro: [
      "CSS gradients let you blend two or more colours smoothly across a background — a modern look used on buttons, hero sections and cards. Writing the CSS by hand means guessing at colours and angles; a visual generator lets you design the gradient by eye and copies the exact CSS for you.",
      "Choose your colours and direction, preview the result live, and copy ready-to-use CSS. It all runs in your browser, so there's nothing to install.",
    ],
    howTo: [
      "Pick two or more colours for the gradient.",
      "Choose the direction or angle of the blend.",
      "Watch the live preview update as you adjust.",
      "Copy the generated CSS background property.",
      "Paste it straight into your stylesheet.",
    ],
    useCases: [
      "Designing a colourful hero or banner background.",
      "Creating eye-catching gradient buttons.",
      "Adding depth to cards and sections.",
      "Experimenting with brand colour combinations.",
      "Generating CSS without memorising gradient syntax.",
    ],
    tips: [
      "Colours that sit near each other on the colour wheel usually blend more smoothly.",
      "Use a subtle gradient for backgrounds and a bolder one for accents like buttons.",
      "Check the gradient still leaves any overlaid text readable — pair it with the contrast checker.",
    ],
    faq: [
      {
        q: "What CSS does it produce?",
        a: "A ready-to-use linear-gradient background value you can paste directly into your CSS.",
      },
      {
        q: "Can I use more than two colours?",
        a: "Yes. Add multiple colour stops to create richer, multi-colour gradients.",
      },
      {
        q: "Is the tool free?",
        a: "Yes, completely free, with no signup, and it runs entirely in your browser.",
      },
    ],
  },

  "color-palette": {
    intro: [
      "A good colour palette is the backbone of any design. Starting from a single colour you like, you can build a harmonious set of related shades and complementary colours that work well together — the foundation for a website, brand or illustration.",
      "This palette generator creates coordinated colour schemes from a base colour and gives you the HEX codes to copy. It runs entirely in your browser.",
    ],
    howTo: [
      "Choose or enter a base colour to build around.",
      "Generate a palette of coordinated colours.",
      "Regenerate until you find a combination you like.",
      "Copy the HEX code of any colour with a click.",
      "Use the palette across your design for a consistent look.",
    ],
    useCases: [
      "Choosing a colour scheme for a new website or brand.",
      "Finding shades that complement your main brand colour.",
      "Building a consistent set of UI colours.",
      "Getting inspiration when you're stuck on colour choices.",
      "Creating coordinated colours for charts or illustrations.",
    ],
    tips: [
      "Limit a design to a few core colours plus neutrals — too many colours looks chaotic.",
      "Reserve one bright accent colour for calls to action so they stand out.",
      "Always test text and background pairs for readability with a contrast checker.",
    ],
    faq: [
      {
        q: "How are the palettes created?",
        a: "They're built from colour-theory relationships around your base colour, giving you shades and complements that work together.",
      },
      {
        q: "Can I copy the colours?",
        a: "Yes. Each colour shows its HEX code and copies to your clipboard with a click.",
      },
      {
        q: "Is it free?",
        a: "Yes, and it runs entirely in your browser with no signup.",
      },
    ],
  },

  "contrast-checker": {
    intro: [
      "If text doesn't contrast enough with its background, it's hard to read — especially for people with low vision. The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios that text should meet. This checker measures the contrast between a text colour and a background colour and tells you whether it passes.",
      "Enter a text colour and a background colour to get the exact contrast ratio and see which WCAG levels (AA and AAA) it passes for normal and large text. It runs in your browser.",
    ],
    howTo: [
      "Choose or enter the text colour.",
      "Choose or enter the background colour.",
      "Read the calculated contrast ratio.",
      "Check which WCAG levels it passes for normal and large text.",
      "Adjust the colours until it meets the level you need.",
    ],
    useCases: [
      "Making sure body text on your website is readable.",
      "Checking button and link colours meet accessibility standards.",
      "Verifying a brand colour pairing before launch.",
      "Meeting WCAG AA or AAA requirements for a client or audit.",
      "Improving readability for users with low vision.",
    ],
    tips: [
      "WCAG AA requires a ratio of at least 4.5:1 for normal text and 3:1 for large text.",
      "Large text (roughly 18pt, or 14pt bold) has a lower threshold because it's easier to read.",
      "Don't rely on colour alone to convey meaning — pair it with text or icons.",
    ],
    faq: [
      {
        q: "What contrast ratio do I need?",
        a: "WCAG AA needs 4.5:1 for normal text and 3:1 for large text; AAA needs 7:1 and 4.5:1 respectively.",
      },
      {
        q: "What's the difference between AA and AAA?",
        a: "AA is the common standard most sites aim for; AAA is a stricter, enhanced level for maximum readability.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. The contrast is calculated entirely in your browser.",
      },
    ],
  },
};
