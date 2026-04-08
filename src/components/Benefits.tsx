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

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <b.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
