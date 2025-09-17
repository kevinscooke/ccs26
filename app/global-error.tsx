"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  console.error("GLOBAL ERROR:", error); // shows in Netlify function logs
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h1>Something went wrong.</h1>
          <p>We’ve logged it and are on it.</p>
        </div>
      </body>
    </html>
  );
}
