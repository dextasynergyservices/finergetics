export const instant = false;

import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/modules/page-editor";
import type { PageInput, PageKey } from "@/lib/schemas/page";
import type { PageSection } from "@/lib/schemas/sections";
import { requireRole } from "@/server/auth/guard";
import { getAdminPageByKey } from "@/server/queries/admin";

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function AdminEditPage(props: PageProps) {
  await requireRole("editor");
  const { key } = await props.params;
  const page = await getAdminPageByKey(key);

  if (!page) {
    notFound();
  }

  const initialData: PageInput = {
    key: page.key as PageKey,
    title: page.title,
    seoTitle: page.seoTitle || "",
    seoDescription: page.seoDescription || "",
    ogImage: page.ogImage,
    sections: (page.sections as PageSection[]) || [],
    status: page.status,
  };

  return <PageEditor pageKey={page.key as PageKey} initialData={initialData} />;
}
