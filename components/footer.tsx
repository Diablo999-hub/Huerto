import { Leaf } from "lucide-react"

const footerLinks = {
  recursos: [
    { label: "Guía de Plantas", href: "#" },
    { label: "Blog Científico", href: "#" },
    { label: "Calendario de Siembra", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  comunidad: [
    { label: "Foro", href: "/comunidad" },
    // Removed non-functional social links
    // { label: "Instagram", href: "#" },
    // { label: "YouTube", href: "#" },
  ],
  legal: [
    { label: "Privacidad", href: "/aviso-legal#datos" },
    { label: "Términos", href: "/aviso-legal" },
    // Removed non-functional contact link
    // { label: "Contacto", href: "/aviso-legal#contacto" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Huerto en Casa</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Democratizando el conocimiento agrícola básico. 
              Porque cultivar tu propia comida no debería ser complicado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Recursos</h4>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Comunidad</h4>
            <ul className="space-y-3">
              {footerLinks.comunidad.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Huerto en Casa. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con amor por la tierra
          </p>
        </div>
      </div>
    </footer>
  )
}
