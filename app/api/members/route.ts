import { NextResponse } from "next/server";
import { getStoredMembers, saveNewMember } from "@/lib/server-data";
import type { Member, ChandaRecord } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { members, chandaRecords } = getStoredMembers();
    return NextResponse.json({ success: true, members, chandaRecords });
  } catch (error) {
    console.error("Members GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, city, area, monthly_amount, start_month, start_year } = body;

    if (!name || !phone || !monthly_amount) {
      return NextResponse.json(
        { success: false, error: "Name, phone number, and monthly amount are required" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, "");
    const newId = `member-${Date.now()}`;
    const sMonth = Number(start_month) || 1;
    const sYear = Number(start_year) || 2026;

    const newMember: Member = {
      id: newId,
      organization_id: "org-001",
      name: name.trim(),
      phone: cleanPhone,
      city: city?.trim() || "Muzaffarpur",
      area: area?.trim() || null,
      monthly_amount: Number(monthly_amount),
      start_month: sMonth,
      start_year: sYear,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Generate chanda records for all 12 months
    const newRecords: ChandaRecord[] = [];
    for (let m = 1; m <= 12; m++) {
      newRecords.push({
        id: `rec-${newId}-${m}`,
        organization_id: "org-001",
        member_id: newId,
        month: m,
        year: sYear,
        expected_amount: Number(monthly_amount),
        paid_amount: 0,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const { members, chandaRecords } = saveNewMember(newMember, newRecords);

    return NextResponse.json({
      success: true,
      message: "Member added successfully and synchronized to all devices!",
      member: newMember,
      records: newRecords,
      totalMembers: members.length,
    });
  } catch (error) {
    console.error("Members POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    );
  }
}
