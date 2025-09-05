import Link from "next/link"
import { Leaf, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer({ locale }: { locale: string }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">AICMT</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              From Nature, For Nature. CPCB Certified compostable solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wide">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href={`/${locale}/products`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wide">Contact Us</h3>
            <address className="mt-4 space-y-2 not-italic text-sm text-muted-foreground">
              <p>info@aicmtinternational.com</p>
              <p>+91-7075500868</p>
              <p>Hyderabad, Telangana, India</p>
            </address>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wide">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} AICMT International. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
