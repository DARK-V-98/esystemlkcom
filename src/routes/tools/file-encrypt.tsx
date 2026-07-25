import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolLayout, ToolBtn, UploadArea } from "@/components/tools/ToolLayout";
import { ToolArticle, toolFaqLd } from "@/components/tools/ToolArticle";
import { TOOL_ARTICLES } from "@/data/toolArticles";
import { Lock, Unlock, Download } from "lucide-react";

const LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free File Encryptor & Decryptor Online",
  "description": "Encrypt or decrypt any file with AES-256 using a password. Runs 100% in your browser — files are never uploaded.",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "url": "https://www.esystemlk.com/tools/file-encrypt",
});

export const Route = createFileRoute("/tools/file-encrypt")({
  head: () => ({
    meta: [
      { title: "Free File Encryptor & Decryptor Online — AES-256 | ESYSTEMLK Tools" },
      { name: "description", content: "Encrypt or decrypt any file with AES-256-GCM encryption using a password. 100% browser-based — your files are never uploaded to any server. Free." },
      { name: "keywords", content: "file encryptor online free, file decryptor online, AES encryption online, encrypt file with password, secure file encryption browser, decrypt file online free" },
      { property: "og:title", content: "Free File Encryptor & Decryptor — AES-256 Online" },
      { property: "og:url", content: "https://www.esystemlk.com/tools/file-encrypt" },
    ],
    links: [{ rel: "canonical", href: "https://www.esystemlk.com/tools/file-encrypt" }],
    scripts: [
      { type: "application/ld+json", children: LD },
      { type: "application/ld+json", children: toolFaqLd(TOOL_ARTICLES["file-encrypt"].faq) },
    ],
  }),
  component: FileEncryptPage,
});

async function deriveKey(password: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function FileEncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ bytes: ArrayBuffer; name: string } | null>(null);

  const process = async () => {
    if (!file || !password) return;
    setLoading(true);
    setStatus("");
    setResult(null);
    try {
      const buf = await file.arrayBuffer();
      if (mode === "encrypt") {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buf);
        // Format: [4 magic bytes][16 salt][12 iv][encrypted data]
        const magic = new Uint8Array([0x45, 0x53, 0x59, 0x53]); // ESYS
        const out = new Uint8Array(4 + 16 + 12 + encrypted.byteLength);
        out.set(magic, 0);
        out.set(salt, 4);
        out.set(iv, 20);
        out.set(new Uint8Array(encrypted), 32);
        setResult({ bytes: out.buffer, name: file.name + ".esys" });
        setStatus("✓ Encrypted successfully!");
      } else {
        const data = new Uint8Array(buf);
        const magic = data.slice(0, 4);
        if (magic[0] !== 0x45 || magic[1] !== 0x53 || magic[2] !== 0x59 || magic[3] !== 0x53) {
          setStatus("❌ This file was not encrypted with this tool.");
          setLoading(false);
          return;
        }
        const salt = data.slice(4, 20);
        const iv = data.slice(20, 32);
        const encrypted = data.slice(32);
        const key = await deriveKey(password, salt);
        try {
          const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted);
          const name = file.name.endsWith(".esys") ? file.name.slice(0, -5) : "decrypted-" + file.name;
          setResult({ bytes: decrypted, name });
          setStatus("✓ Decrypted successfully!");
        } catch {
          setStatus("❌ Wrong password or corrupted file.");
        }
      }
    } catch (e) {
      setStatus("❌ An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([result.bytes]));
    a.download = result.name;
    a.click();
  };

  return (
    <ToolLayout
      title="File Encrypt / Decrypt"
      description="AES-256-GCM encryption — the same standard used by banks. Your file never leaves your device."
      article={<ToolArticle title="File Encrypt / Decrypt" data={TOOL_ARTICLES["file-encrypt"]} />}
    >
      <div className="space-y-6">
        {/* Mode */}
        <div className="flex gap-3">
          {(["encrypt", "decrypt"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setResult(null); setStatus(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                mode === m ? "bg-neon text-white border-neon" : "bg-white border-border text-text-secondary hover:border-neon/50"
              }`}
            >
              {m === "encrypt" ? <><Lock className="w-4 h-4" /> Encrypt</> : <><Unlock className="w-4 h-4" /> Decrypt</>}
            </button>
          ))}
        </div>

        <UploadArea
          label={mode === "encrypt" ? "Drop any file to encrypt" : "Drop a .esys encrypted file"}
          accept="*"
          onChange={(f) => { setFile(f); setResult(null); setStatus(""); }}
          file={file}
        />

        {file && (
          <>
            <div>
              <label className="text-sm text-text-secondary block mb-1">Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon"
              />
              {mode === "encrypt" && <p className="text-xs text-text-muted mt-1">Remember this password — it cannot be recovered.</p>}
            </div>
            <div className="flex gap-3 flex-wrap items-center">
              <ToolBtn onClick={process} disabled={loading || !password}>
                {loading ? "Processing…" : mode === "encrypt" ? "Encrypt File" : "Decrypt File"}
              </ToolBtn>
              {result && (
                <ToolBtn variant="outline" onClick={download}>
                  <Download className="w-4 h-4" /> Download {result.name}
                </ToolBtn>
              )}
            </div>
            {status && (
              <p className={`text-sm font-medium ${status.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                {status}
              </p>
            )}
          </>
        )}
        <div className="bg-bg-blue/40 rounded-xl p-4 text-sm text-text-secondary">
          🔒 Uses <strong>AES-256-GCM</strong> + <strong>PBKDF2</strong> (200,000 iterations). Your file is processed entirely in your browser and never sent to any server.
        </div>
      </div>
    </ToolLayout>
  );
}
