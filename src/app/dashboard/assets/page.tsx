import { prisma } from '@/lib/prisma';
import { AssetLibraryClient } from './AssetLibraryClient';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
  const user = await prisma.user.findUnique({
    where: { email: 'demo@dynamo.app' },
    select: { companyId: true },
  });

  const assets = user?.companyId
    ? await prisma.asset.findMany({
        where: { companyId: user.companyId },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Library</h1>
        <p className="text-neutral-400 mt-2">Manage tombstones and documents that power your AI-generated portals.</p>
      </div>
      <AssetLibraryClient initialAssets={assets} />
    </div>
  );
}
