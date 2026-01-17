"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { BlogFormData, PlaceImage } from "@/types/blog";
import { createBlog, updateBlog, getBlogById, getAllBlogs, uploadImage } from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [placeImages, setPlaceImages] = useState<PlaceImage[]>([]);

  useEffect(() => {
    if (editId) {
      loadBlog(editId);
    }
  }, [editId]);

  async function loadBlog(id: string) {
    try {
      setLoading(true);
      let blog;

      try {
        blog = await getBlogById(id);
      } catch {
        // Fallback: fetch all blogs and find by id
        const allBlogs = await getAllBlogs();
        blog = allBlogs.find((b) => b.id === id || b._id === id);
        if (!blog) {
          throw new Error("Blog not found");
        }
      }

      setTitle(blog.title);
      setExcerpt(blog.excerpt);
      setCoverImage(blog.coverImage || "");
      setTagInput(blog.tags?.join(", ") || "");

      let htmlContent = blog.content;
      if (!htmlContent.includes("<")) {
        htmlContent = blog.content
          .split("\n\n")
          .filter(Boolean)
          .map((p) => `<p>${p}</p>`)
          .join("");
      }
      setContent(htmlContent);
      setPlaceImages(blog.placeImages || []);
    } catch {
      alert("Failed to load blog");
      router.push("/studio");
    } finally {
      setLoading(false);
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      console.error("Cover upload error:", err);
      alert("Failed to upload cover image. Make sure the backend is running.");
    } finally {
      setUploading(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        const newImage: PlaceImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url,
          caption: "",
          alt: file.name.split(".")[0],
        };
        setPlaceImages((prev) => [...prev, newImage]);
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image. Make sure the backend is running.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const updateImageCaption = (id: string, caption: string) => {
    setPlaceImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption } : img))
    );
  };

  const removeImage = (id: string) => {
    setPlaceImages((prev) => prev.filter((img) => img.id !== id));
  };

  const htmlToText = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  async function handleSubmit(publish: boolean) {
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!content.trim() || content === "<br>") {
      alert("Please add some content");
      return;
    }

    const plainText = htmlToText(content);
    const finalExcerpt = excerpt.trim() || plainText.slice(0, 160).trim() + "...";
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);

    const data: BlogFormData = {
      title,
      content: content,
      excerpt: finalExcerpt,
      coverImage: coverImage || undefined,
      placeImages,
      isPublished: publish,
      tags,
    };

    try {
      setSaving(true);
      if (editId) {
        await updateBlog(editId, data);
      } else {
        await createBlog(data);
      }
      router.push("/studio");
    } catch {
      alert("Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted)]">Loading your story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="bg-[var(--background-card)] border-b border-[var(--border)] mb-8">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/studio")}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Cover Image */}
        <div className="mb-8">
          {coverImage ? (
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden group">
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium"
                >
                  Change
                </button>
                <button
                  onClick={() => setCoverImage("")}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-10 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex flex-col items-center gap-2"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Add cover image</span>
                </>
              )}
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            ref={coverInputRef}
            className="hidden"
          />
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-4xl font-serif bg-transparent border-none outline-none placeholder:text-[var(--muted-soft)] mb-6"
        />

        {/* Rich Text Editor */}
        <div className="mb-8">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Tell your story..."
          />
        </div>

        {/* Place Images Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">
              Gallery Images
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              Add Images
            </button>
          </div>

          {placeImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {placeImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--background-alt)]">
                    <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={img.caption || ""}
                    onChange={(e) => updateImageCaption(img.id, e.target.value)}
                    placeholder="Add caption..."
                    className="w-full mt-2 text-xs text-[var(--muted)] placeholder:text-[var(--muted-soft)] bg-transparent border-none outline-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-8 border-2 border-dashed border-[var(--border)] rounded-lg text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors flex flex-col items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Add gallery images (optional)</span>
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Metadata Section */}
        <div className="pt-8 border-t border-[var(--border)]">
          <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-6">
            Post Details
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[var(--foreground)] mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary (auto-generated if empty)"
                rows={3}
                className="w-full px-4 py-3 bg-[var(--background-card)] rounded-lg border border-[var(--border)] focus:border-[var(--accent)] outline-none resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--foreground)] mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="travel, poetry, thoughts (comma separated)"
                className="w-full px-4 py-3 bg-[var(--background-card)] rounded-lg border border-[var(--border)] focus:border-[var(--accent)] outline-none text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WriteForm />
    </Suspense>
  );
}
