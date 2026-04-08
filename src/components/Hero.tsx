import { useState } from "react";
import { motion } from "framer-motion";
import { collection, runTransaction, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isAllowedDomain, MAX_WAITLIST } from "@/lib/domains";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";
import { toast } from "sonner";

export default function Hero() {
  const { available, isFull, loading } = useWaitlistCount();
  const [correo, setCorreo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.trim()) {
      toast.error("Por favor ingresa tu correo.");
      return;
    }
    if (!isAllowedDomain(correo)) {
      toast.error("Este correo no corresponde a una empresa del Grupo Bolívar.");
      return;
    }

    setSubmitting(true);
    try {
      const existing = await getDocs(
        query(collection(db, "waitlist"), where("correo", "==", correo.toLowerCase().trim())),
      );
      if (!existing.empty) {
        toast.error("Este correo ya está registrado en la lista.");
        setSubmitting(false);
        return;
      }

      const counterRef = doc(db, "_meta", "waitlist_counter");
      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let currentCount = 0;
        if (counterDoc.exists()) {
          currentCount = counterDoc.data().count || 0;
        }
        const newPosition = currentCount + 1;
        const estado = newPosition <= MAX_WAITLIST ? "inscrito" : "en_espera";

        const newDocRef = doc(collection(db, "waitlist"));
        transaction.set(newDocRef, {
          correo: correo.toLowerCase().trim(),
          posicion: newPosition,
          estado,
          createdAt: serverTimestamp(),
        });
        transaction.set(counterRef, { count: newPosition }, { merge: true });
      });

      setSubmitted(true);
      toast.success("¡Te has registrado exitosamente!");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center gradient-hero overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container relative z-10 text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <motion.img
            src="https://sb-dominique-prod.web.app/assets/Orbe%20color%20dominique%20gif-Dcqpkmax.gif"
            alt="Dominique orbe animado"
            className="w-28 h-28 md:w-36 md:h-36 mb-6 rounded-full shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-primary-foreground mb-4">
            Dominique
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-foreground/90 max-w-3xl mx-auto mb-4">
            Investiga, diseña, construye y sustenta iniciativas de clase mundial; de forma sencilla, confiable y
            amigable.
          </p>
          <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            ¡Reserva tu cupo: Registra tu correo para asegurar tu acceso anticipado!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-6 max-w-md mx-auto"
        >
          {submitted ? (
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl px-8 py-6">
              <div className="text-3xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-primary-foreground mb-2">¡Estás dentro!</h3>
              <p className="text-primary-foreground/70 text-sm">
                Te notificaremos cuando Dominique esté lista para ti.
              </p>
            </div>
          ) : !isFull ? (
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                maxLength={255}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="flex-1 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm px-5 py-3.5 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                placeholder="tu@empresa.com"
              />
              <button
                type="submit"
                disabled={submitting}
                className="gradient-cta text-primary font-bold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {submitting ? "Registrando..." : "Registrarme"}
              </button>
            </form>
          ) : (
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl px-8 py-4">
              <p className="text-primary-foreground font-semibold">Los 100 primeros ya están dentro.</p>
            </div>
          )}

          <div className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-6 py-3">
            <div className={`w-3 h-3 rounded-full ${isFull ? "bg-destructive" : "bg-green-400 animate-pulse-slow"}`} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary-foreground/90 max-w-3xl mx-auto mb-4"
        >
          Solo 100 colaboradores tendrán acceso en esta primera fase. Sé uno de ellos.
        </motion.p>
      </div>
    </section>
  );
}
