import { NextResponse } from "next/server";
import { getStoredPayments, saveNewPayment, getStoredMembers } from "@/lib/server-data";
import { getPaymentStatus } from "@/lib/calculations";
import type { Payment, Receipt, ChandaRecord } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { payments, receipts } = getStoredPayments();
    return NextResponse.json({ success: true, payments, receipts });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { member_id, amount, payment_method, month, year, payment_date } = body;

    if (!member_id || !amount || !payment_method || !month || !year) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields" },
        { status: 400 }
      );
    }

    const { payments } = getStoredPayments();
    const { chandaRecords } = getStoredMembers();

    const paymentId = `pay-${Date.now()}`;
    const receiptNum = `QJM-${String(payments.length + 1).padStart(6, "0")}`;
    const todayStr = payment_date || new Date().toISOString().split("T")[0];

    const existingRec = chandaRecords.find(
      (r) => r.member_id === member_id && r.month === Number(month) && r.year === Number(year)
    );

    const newPayment: Payment = {
      id: paymentId,
      organization_id: "org-001",
      member_id,
      chanda_record_id: existingRec ? existingRec.id : `rec-${member_id}-${month}`,
      amount: Number(amount),
      payment_method,
      payment_date: todayStr,
      receipt_number: receiptNum,
      recorded_by: "user-001",
      status: "success",
      cancellation_reason: null,
      cancelled_by: null,
      cancelled_at: null,
      created_at: new Date().toISOString(),
    };

    const newReceipt: Receipt = {
      id: `receipt-${paymentId}`,
      organization_id: "org-001",
      payment_id: paymentId,
      receipt_number: receiptNum,
      pdf_url: null,
      created_at: new Date().toISOString(),
    };

    let updatedRecord: ChandaRecord | undefined;
    if (existingRec) {
      const updatedPaid = existingRec.paid_amount + Number(amount);
      const newStatus = getPaymentStatus(existingRec.expected_amount, updatedPaid);
      updatedRecord = {
        ...existingRec,
        paid_amount: updatedPaid,
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
    }

    const result = saveNewPayment(newPayment, newReceipt, updatedRecord);

    return NextResponse.json({
      success: true,
      message: "Payment recorded and synced to all devices!",
      payment: newPayment,
      receipt: newReceipt,
      updatedRecord,
    });
  } catch (error) {
    console.error("Payments POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
