import { notFound } from "next/navigation";
import { Modal } from "@/components/modal";
import { EntryDetail } from "@/components/entry-detail";
import { getEntry } from "@/lib/queries";

/**
 * 拦截路由：从列表点击卡片时，渲染成弹窗而非整页跳转。
 * URL 仍然是 /entries/{id}，刷新会落到 app/entries/[id]/page.tsx 的完整页面。
 */
export default async function EntryModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  return (
    <Modal>
      <EntryDetail entry={entry} />
    </Modal>
  );
}
