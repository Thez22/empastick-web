import { useScrollAnimations } from '../hooks/useScrollAnimations'

// Photos de l'équipe : fichier = prénom (titre affiché)
const TEAM_FILES = [
  'Fatiha.jpg',
  'Manon.jpg',
  'Mohamed.jpg',
  'Nesrine.JPG',
  'Paul.jpg',
  'Rim.jpg',
  'Romain.jpg',
  'Simal.jpg',
  'Simon.jpg',
  'Théo.JPG',
]

function prenomFromFilename(filename: string): string {
  const name = filename.replace(/\.[^.]+$/, '')
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

const TEAM = TEAM_FILES.map((file) => ({
  src: `/images/equipe/${file}`,
  name: prenomFromFilename(file),
}))

export default function APropos() {
  useScrollAnimations()

  return (
    <>
      {/* Hero À propos — même langage que l'accueil */}
      <section className="bg-gradient-to-b from-[#fdfdfd] to-[#f5f7f5] -mx-4 sm:-mx-6 py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#7a9e2d] mb-3">
            Qui sommes-nous
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#064e3b] mb-4 md:mb-5 tracking-tight">
            À propos d&apos;Empastick
          </h1>
          <p className="text-[#5c6370] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Une initiative française centrée sur l&apos;autonomie et le bien-vieillir.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-12 md:py-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#064e3b] mb-6">
          Notre histoire
        </h2>
        <div>
          <p className="text-[#1a1d21] text-[15px] sm:text-base leading-relaxed text-justify sm:text-left">
            Empastick est une initiative française née d&apos;un constat simple : vieillir ne devrait jamais signifier renoncer à sortir, marcher ou rencontrer d&apos;autres personnes. Face aux risques de chute et à l&apos;isolement croissant des seniors, nous avons voulu imaginer une solution qui allie sécurité, autonomie et lien social.
          </p>
          <p className="text-[#1a1d21] text-[15px] sm:text-base leading-relaxed mt-4 text-justify sm:text-left">
            Nous croyons qu&apos;une technologie utile doit être simple, discrète et accessible à tous. Empastick ne se limite pas à un objet connecté : c&apos;est une vision du bien-vieillir, où liberté rime avec sérénité. Notre ambition est de contribuer activement à la Silver économie en France en proposant une solution innovante, responsable et centrée sur l&apos;humain. Parce qu&apos;avancer en âge ne doit jamais empêcher d&apos;avancer tout court.
          </p>
        </div>
      </section>

      {/* Notre équipe — fond léger pour détacher */}
      <section className="bg-white py-12 md:py-16 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#7a9e2d] mb-2">
            L&apos;équipe
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#064e3b] mb-8 md:mb-10">
            Notre équipe
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
            {TEAM.map((m, i) => (
              <div
                key={i}
                className="group text-center"
              >
                <div className="relative overflow-hidden rounded-2xl mb-3 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={m.src}
                    alt={m.name}
                    title={m.name}
                    className="w-full aspect-square object-cover"
                  />
                </div>
                <span className="font-medium text-[#1a1d21] text-sm sm:text-base">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibilité — bloc accent orange comme sur l'accueil */}
      <section className="bg-[#EB5E4E] py-12 md:py-16 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-8 md:mb-10">
            Accessibilité & contact
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-5 text-white/95">
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Accès physique</h3>
                <p className="text-sm sm:text-base">
                  Nous facilitons l&apos;accès aux espaces et aux scènes pour les personnes à mobilité réduite.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg mb-1">Assistance et contact</h3>
                <p className="text-sm sm:text-base mb-3">
                  Pour toute question concernant l&apos;accessibilité du site ou de nos solutions, contactez-nous.
                </p>
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:contact@empastick.fr"
                    className="text-white font-medium underline underline-offset-2 hover:no-underline"
                  >
                    contact@empastick.fr
                  </a>
                  <span className="text-white/90">+33 (0)0 00 00 00 00</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
              <img
                src="/images/main/plan.png"
                alt="Plan d'accès"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA visuel — votre bâton votre style */}
      <section className="bg-[#f8f7f4] py-12 md:py-16 -mx-4 sm:-mx-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#064e3b] mb-6">
            Votre bâton, votre style
          </h2>
          <img
            src="/images/lavande/photoshopempastick.png"
            alt="Utilisatrices Empastick"
            className="max-w-lg mx-auto w-full rounded-2xl shadow-md"
          />
        </div>
      </section>
    </>
  )
}
