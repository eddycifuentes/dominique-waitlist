export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-border bg-card">
      <div className="container max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold text-gradient">Dominique</span>
          <span className="text-muted-foreground text-sm">×</span>
          <span className="text-sm font-semibold text-foreground">Grupo Bolívar</span>
        </div>
        <p className="text-xs text-muted-foreground text-center md:text-right">
          Grupo Bolívar. Todos los derechos reservados © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
