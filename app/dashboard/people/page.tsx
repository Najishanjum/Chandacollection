"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useChandaStore } from "@/lib/chanda-store";
import { useLanguage } from "@/lib/i18n";
import { formatIndianCurrency } from "@/lib/utils";
import { AddPersonModal } from "@/components/dashboard/AddPersonModal";
import type { MemberWithStatus } from "@/types/database";
import type { PaymentStatus } from "@/lib/calculations";

const ITEMS_PER_PAGE = 15;

export default function PeoplePage() {
  const { getMembersWithStatus } = useChandaStore();
  const { t, language } = useLanguage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all");
  const [page, setPage] = useState(1);

  const allMembers = useMemo(() => getMembersWithStatus(9, 2026), [getMembersWithStatus]);

  // Filter and search
  const filtered = useMemo(() => {
    let result = allMembers;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          (m.area && m.area.toLowerCase().includes(q))
      );
    }

    if (filter !== "all") {
      result = result.filter((m) => m.current_month_status === filter);
    }

    return result;
  }, [allMembers, search, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const filterCounts = useMemo(() => {
    return {
      all: allMembers.length,
      paid: allMembers.filter((m) => m.current_month_status === "paid").length,
      partial: allMembers.filter((m) => m.current_month_status === "partial").length,
      pending: allMembers.filter((m) => m.current_month_status === "pending").length,
    };
  }, [allMembers]);

  function getStatusBadge(status: PaymentStatus) {
    const styles: Record<PaymentStatus, string> = {
      paid: "badge badge-paid",
      partial: "badge badge-partial",
      pending: "badge badge-pending",
      cancelled: "badge badge-cancelled",
    };

    let label = t.pending;
    if (status === "paid") label = `✓ ${t.paid}`;
    else if (status === "partial") label = `◐ ${t.partial}`;
    else if (status === "pending") label = `○ ${t.pending}`;
    else if (status === "cancelled") label = t.cancelled;

    return <span className={styles[status]}>{label}</span>;
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] font-bold text-2xl sm:text-3xl uppercase tracking-tight">
            {t.people}
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-1">
            {allMembers.length} {t.allMembers}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="brutal-btn brutal-btn-primary self-start sm:self-auto"
        >
          <UserPlus size={16} />
          {t.addPerson}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6860]"
        />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="brutal-input pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: t.filterAll },
            { key: "paid", label: t.filterPaid },
            { key: "partial", label: t.filterPartial },
            { key: "pending", label: t.filterPending },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`brutal-btn brutal-btn-sm ${
              filter === f.key ? "brutal-btn-primary" : "brutal-btn-white"
            }`}
          >
            {f.label}
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[0.625rem]">
              {filterCounts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table — Desktop */}
      <div className="hidden md:block">
        <table className="brutal-table">
          <thead>
            <tr>
              <th>{t.fullName}</th>
              <th>{t.mobileNumber}</th>
              <th>{t.cityArea}</th>
              <th>{t.monthlyChanda}</th>
              <th>{t.thisMonth}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((member) => (
              <tr key={member.id} className="cursor-pointer">
                <td>
                  <Link
                    href={`/dashboard/people/${member.id}`}
                    className="font-[family-name:var(--font-space-grotesk)] font-semibold hover:text-[#252BFF] transition-colors"
                  >
                    {member.name}
                  </Link>
                </td>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  {member.phone}
                </td>
                <td className="text-[#6B6860] text-sm">{member.area || member.city || "—"}</td>
                <td className="font-[family-name:var(--font-space-grotesk)] font-semibold">
                  {formatIndianCurrency(member.monthly_amount)}
                </td>
                <td className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  {member.current_month_paid > 0
                    ? formatIndianCurrency(member.current_month_paid)
                    : "—"}
                </td>
                <td>{getStatusBadge(member.current_month_status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — Mobile */}
      <div className="md:hidden space-y-3">
        {paginated.map((member) => (
          <Link
            key={member.id}
            href={`/dashboard/people/${member.id}`}
            className="brutal-card brutal-card-hover p-4 block"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-[family-name:var(--font-space-grotesk)] font-bold">
                  {member.name}
                </p>
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860] mt-0.5">
                  {member.phone}
                </p>
              </div>
              {getStatusBadge(member.current_month_status)}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4D3C9]">
              <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
                {member.area || member.city}
              </span>
              <span className="font-[family-name:var(--font-space-grotesk)] font-bold">
                {formatIndianCurrency(member.monthly_amount)}/mo
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {paginated.length === 0 && (
        <div className="brutal-card p-8 text-center">
          <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg uppercase mb-2">
            No people found
          </p>
          <p className="text-[#6B6860] text-sm mb-4">
            {search
              ? "Try a different search term."
              : "Add your first Chanda member to start tracking."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="brutal-btn brutal-btn-primary"
          >
            <UserPlus size={16} />
            {t.addPerson}
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#6B6860]">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="brutal-btn brutal-btn-white brutal-btn-sm"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm flex items-center px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="brutal-btn brutal-btn-white brutal-btn-sm"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
