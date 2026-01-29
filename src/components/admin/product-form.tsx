"use client";

import { addProduct } from "@/app/actions/products";
import { uploadToR2 } from "@/lib/upload-helper";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  ImageIcon,
  FileArchive,
  X,
  Check,
  Package,
} from "lucide-react";
import Image from "next/image";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface FileUploadState {
  file: File | null;
  preview: string | null;
  status: UploadStatus;
  progress: number;
}

export function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productFile, setProductFile] = useState<FileUploadState>({
    file: null,
    preview: null,
    status: "idle",
    progress: 0,
  });
  const [imageFile, setImageFile] = useState<FileUploadState>({
    file: null,
    preview: null,
    status: "idle",
    progress: 0,
  });

  const productInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle product file selection
  const handleProductFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/zip",
        "application/x-zip-compressed",
        "application/octet-stream",
      ];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith(".zip")) {
        toast.error("Invalid File Type", {
          description: "Please upload a PDF or ZIP file.",
        });
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Maximum file size is 100MB.",
        });
        return;
      }

      setProductFile({
        file,
        preview: null,
        status: "idle",
        progress: 0,
      });
      toast.success("File Selected", {
        description: `${file.name} ready for upload.`,
      });
    },
    [],
  );

  // Handle image file selection with preview
  const handleImageFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File Type", {
          description: "Please upload an image file (JPG, PNG, WebP).",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image Too Large", {
          description: "Maximum image size is 10MB.",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile({
          file,
          preview: reader.result as string,
          status: "idle",
          progress: 0,
        });
      };
      reader.readAsDataURL(file);

      toast.success("Image Selected", {
        description: `${file.name} ready for upload.`,
      });
    },
    [],
  );

  // Clear file selection
  const clearProductFile = useCallback(() => {
    setProductFile({ file: null, preview: null, status: "idle", progress: 0 });
    if (productInputRef.current) productInputRef.current.value = "";
  }, []);

  const clearImageFile = useCallback(() => {
    setImageFile({ file: null, preview: null, status: "idle", progress: 0 });
    if (imageInputRef.current) imageInputRef.current.value = "";
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!productFile.file) {
      toast.error("Missing Product File", {
        description: "Please select a digital asset to upload.",
      });
      return;
    }

    if (!imageFile.file) {
      toast.error("Missing Cover Image", {
        description: "Please select a cover image for your product.",
      });
      return;
    }

    const form = e.currentTarget;

    // Get only text field values (NOT the file inputs to avoid 1MB limit)
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const priceInDollars = (
      form.elements.namedItem("priceInDollars") as HTMLInputElement
    ).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;

    if (!name || name.trim().length < 3) {
      toast.error("Invalid Product Name", {
        description: "Product name must be at least 3 characters.",
      });
      return;
    }

    if (!priceInDollars || parseFloat(priceInDollars) < 1) {
      toast.error("Invalid Price", {
        description: "Price must be at least $1.00.",
      });
      return;
    }

    setIsSubmitting(true);

    // Show upload toast
    const uploadToastId = toast.loading("Uploading files...", {
      description: "Please wait while we upload your assets.",
    });

    try {
      // Update states to uploading
      setProductFile((prev) => ({
        ...prev,
        status: "uploading",
        progress: 30,
      }));
      setImageFile((prev) => ({ ...prev, status: "uploading", progress: 30 }));

      // Upload files in parallel directly to R2 (client-side upload)
      const [fileKey, imageKey] = await Promise.all([
        uploadToR2(productFile.file).then((key) => {
          setProductFile((prev) => ({
            ...prev,
            status: "success",
            progress: 100,
          }));
          return key;
        }),
        uploadToR2(imageFile.file).then((key) => {
          setImageFile((prev) => ({
            ...prev,
            status: "success",
            progress: 100,
          }));
          return key;
        }),
      ]);

      toast.loading("Creating product...", {
        id: uploadToastId,
        description: "Saving product to database.",
      });

      // Create a clean FormData with ONLY text fields and R2 keys
      const formData = new FormData();
      formData.set("name", name);
      formData.set("priceInDollars", priceInDollars);
      formData.set("description", description);
      formData.set("fileKey", fileKey);
      formData.set("imageKey", imageKey);

      // Call server action
      const result = await addProduct(null, formData);

      if (result?.error) {
        toast.error("Failed to Create Product", {
          id: uploadToastId,
          description: result.error,
        });
        setProductFile((prev) => ({ ...prev, status: "error" }));
        setImageFile((prev) => ({ ...prev, status: "error" }));
      } else {
        toast.success("Product Created!", {
          id: uploadToastId,
          description: `${name} has been added to your store.`,
        });
        // Form will redirect on success
      }
    } catch (error) {
      // Next.js redirect() throws a NEXT_REDIRECT error - this is expected behavior
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        toast.success("Product Created!", {
          id: uploadToastId,
          description: `${name} has been added to your store.`,
        });
        throw error;
      }

      console.error("Upload error:", error);
      toast.error("Upload Failed", {
        id: uploadToastId,
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
      setProductFile((prev) => ({ ...prev, status: "error" }));
      setImageFile((prev) => ({ ...prev, status: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Product Details Section */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Product Details</h3>
            <p className="text-sm text-muted-foreground">
              Basic information about your digital asset
            </p>
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={3}
            maxLength={100}
            placeholder="e.g. Ultimate Next.js Course"
            className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label
            htmlFor="priceInDollars"
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            Price (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              $
            </span>
            <input
              type="number"
              id="priceInDollars"
              name="priceInDollars"
              required
              min="1"
              step="0.01"
              placeholder="19.99"
              className="block w-full rounded-xl border border-border bg-secondary/30 pl-8 pr-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            Description
            <span className="ml-2 text-muted-foreground/50 font-normal normal-case">
              (optional)
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={1000}
            placeholder="Describe what's included in this digital asset..."
            className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Asset Upload */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10">
              <FileArchive className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Digital Asset</h3>
              <p className="text-sm text-muted-foreground">
                PDF, ZIP up to 100MB
              </p>
            </div>
          </div>

          <input
            ref={productInputRef}
            type="file"
            id="productFile"
            name="productFile"
            accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"
            onChange={handleProductFileChange}
            className="hidden"
          />

          {!productFile.file ? (
            <button
              type="button"
              onClick={() => productInputRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
              </div>
            </button>
          ) : (
            <div className="relative rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileArchive className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {productFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(productFile.file.size)}
                  </p>
                </div>
                {productFile.status === "idle" && (
                  <button
                    type="button"
                    onClick={clearProductFile}
                    className="shrink-0 w-8 h-8 rounded-lg bg-secondary/50 hover:bg-destructive/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
                {productFile.status === "uploading" && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                )}
                {productFile.status === "success" && (
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
              {productFile.status === "uploading" && (
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${productFile.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cover Image Upload */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10">
              <ImageIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cover Image</h3>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, WebP up to 10MB
              </p>
            </div>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />

          {!imageFile.file ? (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
              </div>
            </button>
          ) : (
            <div className="relative rounded-xl border border-border bg-secondary/30 overflow-hidden">
              {imageFile.preview && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={imageFile.preview}
                    alt="Cover preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {imageFile.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}
                  {imageFile.status === "success" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {imageFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(imageFile.file.size)}
                  </p>
                </div>
                {imageFile.status === "idle" && (
                  <button
                    type="button"
                    onClick={clearImageFile}
                    className="shrink-0 w-8 h-8 rounded-lg bg-secondary/50 hover:bg-destructive/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
              {imageFile.status === "uploading" && (
                <div className="px-3 pb-3">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${imageFile.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !productFile.file || !imageFile.file}
        className="w-full rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Product...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Create Product
          </>
        )}
      </button>

      {/* Help Text */}
      <p className="text-center text-xs text-muted-foreground">
        Products can be edited or archived after creation from the products
        dashboard.
      </p>
    </form>
  );
}
