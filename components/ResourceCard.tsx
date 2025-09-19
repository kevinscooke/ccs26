type Props = {
  title: string;
  href: string;
  description?: string;
  badge?: string;
};

export default function ResourceCard({ title, href, description, badge }: Props) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition p-5 focus:outline-none focus:ring"
      rel="noopener noreferrer"
      target={href.startsWith('http') ? '_blank' : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge ? (
          <span className="rounded-full text-xs px-2 py-1 bg-gray-100 border border-gray-200">
            {badge}
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-2 text-sm text-gray-600">{description}</p> : null}
      <span className="mt-3 inline-block text-sm underline">Open</span>
    </a>
  );
}
