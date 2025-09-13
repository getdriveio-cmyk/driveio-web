
import SidebarNav from "@/components/profile/sidebar-nav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1">
        <div className="sticky top-24">
          <SidebarNav />
        </div>
      </aside>
      <main className="md:col-span-3">{children}</main>
    </div>
  );
}
