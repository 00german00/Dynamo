import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex h-16 items-center px-6 gap-6 max-w-7xl mx-auto w-full">
          <Link href="/" className="font-bold flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
           Dynamo
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-neutral-400">
            <Link href="/dashboard" className="text-white">Portals</Link>
            <Link href="/dashboard/assets" className="hover:text-white transition-colors">Assets</Link>
            <Link href="/dashboard/settings" className="hover:text-white transition-colors">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
