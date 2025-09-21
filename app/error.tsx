"use client";
import React from "react";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("App error:", error);
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-zinc-600">An unexpected error occurred. Try refreshing the page.</p>
        <div>
          <button onClick={() => reset()} className="ccs-btn-primary px-4 py-2">Try again</button>
        </div>
      </div>
    </div>
  );
}
