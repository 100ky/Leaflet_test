import Link from "next/link";

export default function SignedOutPage() {
  return (
    <div>
      <h1>Vaše relace vypršela</h1>

      <p>
        Byli jste automaticky odhlášeni. Pro pokračování se můžete znovu
        přihlásit, nebo pokračovat na hlavní stránku bez přihlášení.
      </p>

      <Link href="/">Pokračovat na hlavní stránku</Link>
    </div>
  );
}
