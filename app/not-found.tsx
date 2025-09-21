import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-sm text-zinc-600">We couldn't find what you were looking for.</p>
        <div>
          <Link href="/" className="ccs-btn-primary px-4 py-2">Return home</Link>
        </div>
      </div>
    </div>
  );
}
