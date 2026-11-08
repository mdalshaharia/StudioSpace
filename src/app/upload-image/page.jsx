"use client";

/**
 * StudioSpace – Image upload page (ImgBB)
 * Theme:   #244855 (deep teal) + #E64833 (red-orange)
 * Upload:  lib/uploadImage.js → uploadImageToImgBB
 */

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, ImageIcon, Loader2, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { uploadImageToImgBB } from "../lib/uploadImage";
import { useSession } from "../lib/auth-client";
import { LoaderScreen } from "@/components/Skeletons";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

const inputCls =
  "h-11 rounded-xl border-border bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-[#E64833]/60";

export default function UploadImagePage() {
  const { data: session, isPending } = useSession();

  if (isPending || !session) {
    return <LoaderScreen />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <section className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
          <ImageUploadCard />
        </section>
      </div>
      <Footer />
    </main>
  );
}

function ImageUploadCard() {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // [{ file, preview }]
  const [uploaded, setUploaded] = useState({}); // preview -> live URL
  const [liveUrl, setLiveUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const pending = files.filter(({ preview }) => !uploaded[preview]);

  const addFiles = (list) => {
    const next = [];
    Array.from(list).forEach((file) => {
      if (!ACCEPT.includes(file.type)) return toast.error(`${file.name}: use JPG, PNG or WebP.`);
      if (file.size > MAX_MB * 1024 * 1024) return toast.error(`${file.name}: over ${MAX_MB} MB.`);
      next.push({ file, preview: URL.createObjectURL(file) });
    });
    if (!next.length) return;
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (i) => {
    const { preview } = files[i];
    URL.revokeObjectURL(preview);
    const all = files.filter((_, idx) => idx !== i);
    setFiles(all);
    setUploaded((prev) => {
      const next = { ...prev };
      delete next[preview];
      return next;
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      toast.success("Link copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  /* send every still-pending file to ImgBB, one after another */
  const uploadAll = async () => {
    if (!pending.length) return;
    setUploading(true);
    let ok = 0;
    let lastUrl = "";

    for (const { file, preview } of pending) {
      try {
        const url = await uploadImageToImgBB(file);
        setUploaded((prev) => ({ ...prev, [preview]: url }));
        lastUrl = url;
        ok += 1;
      } catch (err) {
        toast.error(err?.message || `${file.name}: upload failed. Please try again.`);
      }
    }

    setUploading(false);
    if (ok) {
      setLiveUrl(lastUrl);
      toast.success(
        ok === 1 ? "Image uploaded successfully." : `Uploaded ${ok} images successfully.`,
      );
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-heading text-center">
        Upload images
      </h1>
      <p className="mt-1 text-sm text-muted-foreground text-center">
        Get a live, shareable link for each image.
      </p>

      {/* drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-[#E64833]/60 bg-[#E64833]/5"
            : "border-border bg-muted/50"
        }`}
      >
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#244855]/10 text-heading dark:bg-white/10">
          <UploadCloud className="h-7 w-7" aria-hidden />
        </span>

        <p className="mt-6 text-lg font-bold text-heading">Drag and drop images here</p>
        <p className="mt-3 text-muted-foreground">
          or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-[#E64833] underline-offset-4 hover:text-[#cf3e2b] hover:underline"
          >
            browse your files
          </button>
        </p>
        <p className="mt-4 text-xs text-muted-foreground">JPG, PNG or WebP · up to {MAX_MB} MB each</p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* selected files */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map(({ file, preview }, i) => (
            <li
              key={preview}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {uploaded[preview] && (
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"
                  title="Uploaded"
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* upload action */}
      {files.length > 0 && (
        <Button
          type="button"
          onClick={uploadAll}
          disabled={uploading || pending.length === 0}
          className="mt-5 h-11 w-full rounded-xl border-none bg-[#E64833] font-semibold text-white shadow-sm shadow-[#E64833]/25 hover:bg-[#cf3e2b]"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
            </>
          ) : pending.length > 0 ? (
            `Upload ${pending.length} image${pending.length === 1 ? "" : "s"}`
          ) : (
            <>
              <Check className="mr-1.5 h-4 w-4" /> All images uploaded
            </>
          )}
        </Button>
      )}

      {/* live link + copy */}
      <div className="mt-5 space-y-1.5">
        <Label htmlFor="live-link" className="text-xs font-semibold text-[#E64833]">
          Live image link
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="live-link"
              readOnly
              value={liveUrl}
              placeholder="Your live link will appear here"
              onFocus={(e) => e.target.select()}
              className={`${inputCls} pl-9 text-sm`}
            />
          </div>
          <Button
            type="button"
            onClick={copyLink}
            disabled={!liveUrl}
            className="h-11 rounded-xl border-none bg-[#244855] px-4 font-semibold text-white shadow-sm shadow-[#244855]/25 hover:bg-[#3a6a82]"
          >
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
    </div>
  );
}
