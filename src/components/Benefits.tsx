import { motion } from "framer-motion";
import { Zap, Users } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Acceso anticipado",
    description: "Usa Dominique antes que nadie y lleva ventaja en tus proyectos de innovación.",
  },
  {
    icon: Users,
    title: "Onboarding exclusivo",
    description: "Sesión personalizada para sacar el máximo provecho desde el día uno.",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16"
        >
          ¿Por qué unirte ahora?
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <b.icon className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{b.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
