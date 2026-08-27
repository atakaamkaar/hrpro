import Reveal from "@/components/Reveal";

type Service = {
  icon: string;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: "👤",
    title: "Resume Review",
    description:
      "We'll sit down with your resume and help it sound like you — clear, honest, and easy for the right people to say yes to.",
  },
  {
    icon: "💼",
    title: "Recruitment",
    description:
      "Looking for work? We'll help you find roles that actually fit, not just ones that happen to be hiring.",
  },
  {
    icon: "🎯",
    title: "Career Coaching",
    description:
      "Feeling stuck or unsure what's next? We'll talk it through together and help you find a direction that feels right.",
  },
  {
    icon: "📄",
    title: "CV Writing",
    description:
      "If starting from a blank page feels impossible, we'll help you write a CV that actually sounds like you.",
  },
  {
    icon: "🤝",
    title: "HR Consulting",
    description:
      "Building out your team or policies? We'll help you put people-first practices in place, without the headache.",
  },
  {
    icon: "🏢",
    title: "Employer Recruitment",
    description:
      "Hiring can be overwhelming — we'll help you find people who are the right fit, not just the first available.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A few ways we can help
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            Not sure where you fit? That&apos;s alright — pick whatever
            sounds closest, and we&apos;ll figure out the rest together.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delayMs={(index % 3) * 80}>
              <div className="group rounded-2xl border border-foreground/10 bg-background p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                    ["bg-primary/10", "bg-secondary/10", "bg-accent/10"][index % 3]
                  }`}
                >
                  <span aria-hidden="true">{service.icon}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
