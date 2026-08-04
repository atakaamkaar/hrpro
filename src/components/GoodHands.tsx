type Reassurance = {
  icon: string;
  title: string;
  description: string;
};

const reassurances: Reassurance[] = [
  {
    icon: "👋",
    title: "Real people, not algorithms",
    description:
      "A real person reads your resume and talks with you — we don't let a computer decide if you're \"qualified.\"",
  },
  {
    icon: "🧭",
    title: "Guidance made personal",
    description:
      "No generic advice. We take the time to understand where you're headed before we ever suggest a next step.",
  },
  {
    icon: "🌱",
    title: "Relationships built over time",
    description:
      "We know the employers we work with personally, so we can point you toward people who are actually a good fit.",
  },
];

export default function GoodHands() {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          You&apos;re in good hands
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-foreground/70">
          Here&apos;s what that actually looks like.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
          {reassurances.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <span className="text-4xl" aria-hidden="true">
                {item.icon}
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
