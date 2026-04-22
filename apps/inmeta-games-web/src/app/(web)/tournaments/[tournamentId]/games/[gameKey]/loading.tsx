export default function Loading() {
  return (
    <main>
      <div className="container py-8 space-y-4">
        <div className="h-3 w-40 bg-n-bg3 animate-pulse" />
        <div className="h-8 w-24 bg-n-bg2 border border-n-line animate-pulse" />
        <div className="h-14 w-80 bg-n-bg2 animate-pulse" />
        <div className="w-full aspect-[16/6] bg-n-bg2 border border-n-line animate-pulse mt-4" />
        <div className="space-y-3 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-n-bg2 border-2 border-n-line animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}
