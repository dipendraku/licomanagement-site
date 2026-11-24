import Image from "next/image";
import Link from "next/link";
import { footerColumns } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[radial-gradient(circle_at_top_right,_#18457d_0%,_#011d45_48%,_#00142f_100%)] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 lg:grid-cols-5 lg:px-8">
        <div className="reveal-up lg:col-span-1">
          <div className="mb-4 grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-white/20 bg-white p-1.5">
            <Image
              src="/logo.png"
              alt="Licomanagement logo"
              width={48}
              height={35}
              className="h-auto w-full object-contain"
            />
          </div>
          <p className="max-w-xs text-sm leading-6 text-slate-200">
            Licomanagement Pvt. Ltd. delivers reliable cloud hosting and managed infrastructure for accounting and tax practices.
          </p>
          <p className="mt-4 text-sm text-slate-300">sales@licomanagement.com</p>
          <p className="text-sm text-slate-300">+1-855-922-7243</p>
        </div>

        {footerColumns.map((column, index) => (
          <div
            key={column.title}
            className={`reveal-up rounded-[1.4rem] border border-white/20 bg-[#0d2445bd] p-6 ${
              index === 0 ? "reveal-delay-1" : index === 1 ? "reveal-delay-2" : index === 2 ? "reveal-delay-3" : "reveal-delay-4"
            }`}
          >
            <h3 className="mb-3 text-base font-bold">{column.title}</h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-200 transition hover:text-white hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-slate-300 lg:flex-row lg:px-8 lg:text-left">
          <p>© {new Date().getFullYear()} Lico Management Pvt.Ltd. Developed By Lico Management Team</p>
          <p>Secure Cloud Hosting for Accounting Professionals</p>
        </div>
      </div>
    </footer>
  );
}
