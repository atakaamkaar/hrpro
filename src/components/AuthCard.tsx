export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-1 items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-foreground/70">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
