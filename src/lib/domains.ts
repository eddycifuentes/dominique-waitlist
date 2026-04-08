export const ALLOWED_DOMAINS = [
  "davivienda.com",
  "corredores.com",
  "segurosbolivar.com",
  "zuana.com.co",
  "constructorabolivar.com",
  "fundacionbd.org",
  "grupobolivar.com",
  "cobranzasbeta.com.co",
  "serviciosbolivar.com",
  "cbolivar.com",
  "epayco.com",
  "revistadiners.com.co",
];

export const MAX_WAITLIST = 100;

export function isAllowedDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}
