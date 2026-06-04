"use client";

import { Box } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";

export function AdminProducts() {
  return (
    <AdminGuard>
      {() => (
        <AdminPageFrame title="Products" description="Prepare catalog management for the next phase." backLink>
          <section className="ambient-card p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-container/20 text-primary">
                <Box aria-hidden className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-heading text-2xl font-bold">Product management will be added in the next phase.</h2>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  Future tools will support adding products, editing prices, changing images, and
                  publishing or archiving products.
                </p>
              </div>
            </div>
          </section>
        </AdminPageFrame>
      )}
    </AdminGuard>
  );
}
