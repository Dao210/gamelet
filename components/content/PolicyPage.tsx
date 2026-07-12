type PolicySection = {
  title: string
  text: string
}

type PolicyPageProps = {
  eyebrow?: string
  title: string
  intro: string
  accentClassName: string
  sections: PolicySection[]
}

export default function PolicyPage({
  eyebrow = 'Gamelet',
  title,
  intro,
  accentClassName,
  sections
}: PolicyPageProps) {
  return (
    <main className="bg-[#f8faf6] text-[#171711]">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className={`text-sm font-bold uppercase tracking-[0.24em] ${accentClassName}`}>{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-[#424235]">{intro}</p>
        <div className="mt-10 space-y-8 text-base leading-7 text-[#424235]">
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-[#171711]">{section.title}</h2>
              <p className="mt-2">{section.text}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}
