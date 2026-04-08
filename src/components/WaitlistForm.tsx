import { useState } from "react";
import { collection, runTransaction, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isAllowedDomain, MAX_WAITLIST } from "@/lib/domains";
import { useWaitlistCount } from "@/hooks/useWaitlistCount";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function WaitlistForm() {
  const { isFull } = useWaitlistCount();
  const [form, setForm] = useState({ correo: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.empresa.trim() || !form.motivo_uso.trim()) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    if (!isAllowedDomain(form.correo)) {
      toast.error("Este correo no corresponde a una empresa del Grupo Bolívar.");
      return;
    }

    setSubmitting(true);
    try {
      // Check if email already registered
      const existing = await getDocs(
        query(collection(db, "waitlist"), where("correo", "==", form.correo.toLowerCase().trim()))
      );
      if (!existing.empty) {
        toast.error("Este correo ya está registrado en la lista.");
        setSubmitting(false);
        return;
      }

      // Use transaction to ensure atomic position assignment
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
          nombre: form.nombre.trim(),
          correo: form.correo.toLowerCase().trim(),
          empresa: form.empresa.trim(),
          area: "",
          motivo_uso: form.motivo_uso.trim(),
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

  if (submitted) {
    return (
      <section id="formulario" className="py-24 px-4 bg-muted">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container max-w-lg text-center"
        >
          <div className="bg-card rounded-2xl p-10 shadow-lg border border-border">
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">¡Estás dentro!</h3>
            <p className="text-muted-foreground">
              Te notificaremos cuando Dominique esté lista para ti.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="formulario" className="py-24 px-4 bg-muted">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-3">
            {isFull ? "Lista de espera" : "Reserva tu cupo"}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {isFull
              ? "Los 100 primeros ya están dentro. Déjanos tu correo y te avisamos si se abre un nuevo cupo."
              : "Completa el formulario para asegurar tu acceso anticipado."}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl p-8 shadow-lg border border-border space-y-5"
        >
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-1.5">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              maxLength={100}
              value={form.nombre}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-foreground mb-1.5">
              Correo corporativo
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              maxLength={255}
              value={form.correo}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              placeholder="nombre@empresa.com"
            />
          </div>
          <div>
            <label htmlFor="empresa" className="block text-sm font-medium text-foreground mb-1.5">
              Empresa / Área
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              required
              maxLength={100}
              value={form.empresa}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              placeholder="Ej: Davivienda / Innovación"
            />
          </div>
          <div>
            <label htmlFor="motivo_uso" className="block text-sm font-medium text-foreground mb-1.5">
              ¿Para qué usarías Dominique?
            </label>
            <textarea
              id="motivo_uso"
              name="motivo_uso"
              required
              maxLength={500}
              rows={3}
              value={form.motivo_uso}
              onChange={handleChange}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
              placeholder="Cuéntanos brevemente..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-cta text-primary font-bold py-3.5 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Registrando..." : isFull ? "Unirme a la lista de espera" : "Quiero acceso anticipado"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
