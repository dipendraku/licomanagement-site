import { Component as Globe } from "@/components/ui/interactive-globe";

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="flex min-h-[500px] flex-col md:flex-row">
          <div className="relative z-10 flex flex-1 flex-col justify-center p-10 md:p-14">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              All systems operational
            </div>

            <h2 className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Global Edge
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Network
              </span>
            </h2>

            <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-600 md:text-base">
              Deployed across 150+ points of presence worldwide. Your data served from the nearest node in under 50ms.
              Drag the globe to explore.
            </p>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-slate-900">150+</p>
                <p className="text-xs text-slate-500">Edge Nodes</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">&lt;50ms</p>
                <p className="text-xs text-slate-500">Avg Latency</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">99.99%</p>
                <p className="text-xs text-slate-500">Uptime</p>
              </div>
            </div>
          </div>

          <div className="flex min-h-[400px] flex-1 items-center justify-center p-4 md:p-0">
            <Globe size={460} />
          </div>
        </div>
      </div>
    </div>
  );
}
