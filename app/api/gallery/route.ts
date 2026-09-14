import { NextResponse } from "next/server";
import { getStoredGallery, saveGalleryPhoto, type GalleryPhotoItem } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const photos = getStoredGallery();
    return NextResponse.json({ success: true, photos });
  } catch (error) {
    console.error("Gallery GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { src, title, uploader, category } = body;

    if (!src || !title) {
      return NextResponse.json(
        { success: false, error: "Photo image and title are required" },
        { status: 400 }
      );
    }

    const uploaderName = (uploader && uploader.trim()) ? uploader.trim() : "Community Member";

    const newPhoto: GalleryPhotoItem = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      src,
      title: title.trim(),
      uploader: uploaderName,
      category: category || "community",
      tag: `Community Upload • ${uploaderName}`,
      tagColor: "bg-[#252BFF] text-white",
      location: "Deoria Baradih, Muzaffarpur",
      date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      created_at: new Date().toISOString(),
    };

    const photos = saveGalleryPhoto(newPhoto);

    return NextResponse.json({
      success: true,
      message: "Photo uploaded and shared with all devices successfully!",
      photo: newPhoto,
      photos,
    });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
