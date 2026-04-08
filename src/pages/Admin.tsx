import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, query, orderBy } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";
import { isAllowedDomain } from "@/lib/domains";
import { toast } from "sonner";
import { LogOut, Download, Search, Users, Clock, ChevronDown, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WaitlistEntry {
  id: string;
  nombre: string;
  correo: string;
  empresa: string;
  area: string;
  motivo_uso: string;
  posicion: number;
  estado: string;
  createdAt: any;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    console.log("[Admin] Setting up onAuthStateChanged...");
    const timeout = setTimeout(() => {
      console.log("[Admin] Auth timeout reached, setting authLoading to false");
      setAuthLoading(false);
    }, 5000);

    const unsub = onAuthStateChanged(auth, (u) => {
      clearTimeout(timeout);
      console.log("[Admin] onAuthStateChanged fired, user:", u?.email || "null");
      if (u && u.email && isAllowedDomain(u.email)) {
        setUser(u);
      } else if (u) {
        signOut(auth);
        toast.error("No tienes permisos para acceder.");
        setUser(null);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "waitlist"), orderBy("posicion", "asc"));
      const snap = await getDocs(q);
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as WaitlistEntry));
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      toast.error("Error al iniciar sesión.");
    }
  };

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "waitlist", id), { estado: newStatus });
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, estado: newStatus } : e)));
      toast.success("Estado actualizado.");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar.");
    }
  };

  const resetWaitlist = async () => {
    setResetting(true);
    try {
      const snap = await getDocs(collection(db, "waitlist"));
      const deletePromises = snap.docs.map((d) => deleteDoc(doc(db, "waitlist", d.id)));
      await Promise.all(deletePromises);
      await setDoc(doc(db, "_meta", "waitlist_counter"), { count: 0 });
      setEntries([]);
      toast.success("Waitlist reseteada correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al resetear la waitlist.");
    } finally {
      setResetting(false);
    }
  };
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      (e.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.correo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || e.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    const headers = ["Posición", "Nombre", "Correo", "Empresa", "Área", "Motivo", "Estado", "Fecha"];
    const rows = filteredEntries.map((e) => [
      e.posicion,
      e.nombre,
      e.correo,
      e.empresa,
      e.area,
      e.motivo_uso,
      e.estado,
      e.createdAt?.toDate?.()?.toISOString?.() || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-dominique.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inscritosCount = entries.filter((e) => e.estado === "inscrito").length;
  const enEsperaCount = entries.filter((e) => e.estado === "en_espera").length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-sm shadow-lg">
          <h1 className="text-2xl font-bold text-foreground mb-2">Panel Admin</h1>
          <p className="text-muted-foreground mb-6 text-sm">Dominique Waitlist</p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-semibold py-3 rounded-lg hover:opacity-90 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">[Administrador] Waitlist Dominique</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <div className="container py-8 px-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">Inscritos</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{inscritosCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">En espera</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{enEsperaCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Cupos disponibles</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{Math.max(0, 100 - inscritosCount)}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="todos">Todos</option>
              <option value="inscrito">Inscritos</option>
              <option value="en_espera">En espera</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={fetchEntries}
            className="px-4 py-2.5 rounded-lg border border-input text-sm text-foreground hover:bg-muted transition"
          >
            Refrescar
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={resetting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> {resetting ? "Reseteando..." : "Resetear waitlist"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará todos los registros de la waitlist y reiniciará el contador a 0. Esta acción no
                  se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetWaitlist}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, resetear todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-muted-foreground">#</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Correo</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Empresa</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Estado</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No hay registros.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition">
                    <td className="px-4 py-3 text-foreground">{e.posicion}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{e.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.correo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.empresa}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          e.estado === "inscrito" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {e.estado === "inscrito" ? "Inscrito" : "En espera"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {e.createdAt?.toDate?.()?.toLocaleDateString?.("es-CO") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {e.estado === "en_espera" && (
                        <button
                          onClick={() => changeStatus(e.id, "inscrito")}
                          className="text-xs font-medium text-secondary hover:underline"
                        >
                          Aprobar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
