import { motion } from "framer-motion";
import { Search, Lightbulb, Rocket } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Investigación Estratégica",
    description:
      "Pregúntale cualquier tendencia. Te devuelve un informe estratégico con fuentes reales en minutos.",
  },
  {
    icon: Lightbulb,
    title: "Diseño de Metodologías",
    description:
      "¿Necesitas facilitar una sesión? Dominique diseña el taller por ti.",
  },
  {
    icon: Rocket,
    title: "Impulso de Iniciativas",
    description:
      "Convierte tu idea en una propuesta sólida, diferenciada y lista para presentar.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
        >
          ¿Para qué sirve Dominique?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-muted-foreground mb-16 max-w-xl mx-auto"
        >
          Tres superpoderes para la innovación corporativa.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-card rounded-2xl p-8 border border-border hover:border-secondary/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
