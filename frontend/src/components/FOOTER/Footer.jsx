import { useState } from "react";

const columns = [
  {
    title: "Shop",
    links: ["New Arrivals", "Women", "Men", "Accessories", "Sale", "Gift Cards"],
  },
  {
    title: "Customer care",
    links: [
      "Shipping & Delivery",
      "Returns & Exchanges",
      "Size Guide",
      "Track Order",
      "FAQ",
      "Contact Us",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Sustainability", "Lookbook", "Careers", "Store Locator"],
  },
];

const trust = [
  "Free shipping over $100",
  "30-day easy returns",
  "Secure checkout",
  "Support: Mon–Fri, 9am–6pm",
];

const payments = ["Visa", "Mastercard", "PayPal", "Apple Pay"];

const socials = [
  {
    label: "Instagram",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <>
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 3c.4 2.4 2 4 4.5 4.2" />
      </>
    ),
  },
  {
    label: "Pinterest",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M11 8.5c2.5-1 4.5.5 4 3s-2.5 3.5-4 2.5M11 8.5L9 17" />
      </>
    ),
  },
];

function Chevron({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={`transition-transform md:hidden ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// On mobile each column is an accordion. From md up, links are always visible.
function LinkColumn({ title, links }) {
  const [open, setOpen] = useState(false);
  const id = `footer-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <nav aria-label={title} className="border-b border-stone-800 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-[48px] w-full items-center justify-between text-left text-sm font-medium text-stone-100 md:pointer-events-none md:mb-3 md:min-h-0"
      >
        {title}
        <Chevron open={open} />
      </button>
      <ul
        id={id}
        className={`${open ? "flex" : "hidden"} flex-col gap-3 pb-5 md:flex md:pb-0`}
      >
        {links.map((label) => (
          <li key={label}>
            <a
              href="#"
              className="text-sm text-stone-400 transition-colors hover:text-stone-100 focus-visible:text-stone-100"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | done

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send `email` to your newsletter provider (Klaviyo, Mailchimp, etc.)
    setStatus("done");
    setEmail("");
  };

  return (
    <section className="flex flex-col gap-8 border-b border-stone-800 pb-12 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-xl">
        <h2 className="font-serif text-4xl leading-tight text-stone-50 md:text-5xl">
          Join the list. Get 10% off your first order.
        </h2>
        <p className="mt-3 text-stone-400">
          Early access to new drops, styling notes and private sales.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="min-h-[48px] flex-1 border border-stone-600 bg-transparent px-4 text-stone-100 placeholder:text-stone-500 focus:border-stone-200 focus:outline-none"
          />
          <button
            type="submit"
            className="min-h-[48px] bg-stone-100 px-7 text-sm font-medium text-stone-900 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-100"
          >
            Subscribe
          </button>
        </div>
        <p role="status" className="mt-3 min-h-[1.25rem] text-sm text-stone-400">
          {status === "done" && "Thanks. Check your inbox for your 10% code."}
        </p>
      </form>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 font-sans text-stone-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pb-8 pt-16 md:px-12 md:pt-20 lg:px-16">
        <Newsletter />

        {/* Brand + link columns */}
        <div className="grid gap-8 md:grid-cols-4 md:gap-8">
          <div className="flex flex-col gap-4">
            <a
              href="/"
              className="font-serif text-3xl tracking-[0.25em] text-stone-50"
            >
              ATELIER
            </a>
            <p className="max-w-[240px] text-sm leading-relaxed text-stone-400">
              Considered wardrobe pieces, made to be worn for years.
            </p>
            <div className="flex gap-2">
              {socials.map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center border border-stone-800 text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-100"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <LinkColumn key={col.title} {...col} />
          ))}
        </div>

        {/* Trust bar */}
        <ul className="flex flex-wrap gap-x-10 gap-y-3 border-y border-stone-800 py-6 text-sm text-stone-300">
          {trust.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 text-sm text-stone-400 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {payments.map((p) => (
              <li key={p} className="border border-stone-800 px-3 py-1.5">
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} Atelier. All rights reserved.</span>
            <a href="#" className="hover:text-stone-100">Privacy</a>
            <a href="#" className="hover:text-stone-100">Terms</a>
            <a href="#" className="hover:text-stone-100">Cookie settings</a>
          </div>

          <label className="flex items-center gap-2">
            <span className="sr-only">Language and currency</span>
            <select className="border border-stone-800 bg-stone-950 px-3 py-2 text-stone-300 focus:border-stone-500 focus:outline-none">
              <option>English · USD</option>
              <option>English · EUR</option>
              <option>English · GBP</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}

