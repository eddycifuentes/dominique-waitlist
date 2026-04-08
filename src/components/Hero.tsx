import { motion } from "framer-motion";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";

interface HeroProps {
  onCTA: () => void;
}

export default function Hero({ onCTA }: HeroProps) {
  const { available, isFull, loading } = useWaitlistCount();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-10 text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-primary-foreground mb-4">
            Dominique
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-foreground/90 max-w-3xl mx-auto mb-4">
            La IA que piensa contigo para innovar en grande.
          </p>
          <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            Dominique es tu nuevo consultor de innovación. Investiga, diseña y construye iniciativas de clase mundial. Solo con escribirle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          {!isFull ? (
            <button
              onClick={onCTA}
              className="gradient-cta text-primary font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Quiero acceso anticipado
            </button>
          ) : (
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl px-8 py-4">
              <p className="text-primary-foreground font-semibold">
                Los 100 primeros ya están dentro.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className={`w-3 h-3 rounded-full ${isFull ? "bg-destructive" : "bg-green-400 animate-pulse-slow"}`} />
            <span className="text-primary-foreground/90 font-medium text-sm">
              {loading
                ? "Cargando..."
                : isFull
                ? "Lista cerrada"
                : `${available} cupos disponibles de ${100}`}
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-primary-foreground/50 text-sm"
        >
          Solo 100 colaboradores tendrán acceso en esta primera fase. Sé uno de ellos.
        </motion.p>
      </div>
    </section>
  );
}
