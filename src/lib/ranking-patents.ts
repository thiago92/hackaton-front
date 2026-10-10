export const rankingPatents = [
  { name: "Soldado raso", minimum: 0, symbol: "▰", classes: "border-slate-300 bg-slate-100 text-slate-800" },
  { name: "Soldado", minimum: 100, symbol: "❯", classes: "border-emerald-300 bg-emerald-50 text-emerald-900" },
  { name: "Cabo", minimum: 250, symbol: "❯❯", classes: "border-teal-300 bg-teal-50 text-teal-900" },
  { name: "Sargento", minimum: 500, symbol: "❯❯❯", classes: "border-cyan-300 bg-cyan-50 text-cyan-900" },
  { name: "Subtenente", minimum: 800, symbol: "◆", classes: "border-sky-300 bg-sky-50 text-sky-900" },
  { name: "Tenente", minimum: 1200, symbol: "✦", classes: "border-blue-300 bg-blue-50 text-blue-900" },
  { name: "Capitão", minimum: 1800, symbol: "✦✦", classes: "border-indigo-300 bg-indigo-50 text-indigo-900" },
  { name: "Major", minimum: 2600, symbol: "✦✦✦", classes: "border-violet-300 bg-violet-50 text-violet-900" },
  { name: "Coronel", minimum: 3600, symbol: "★", classes: "border-purple-300 bg-purple-50 text-purple-900" },
  { name: "General", minimum: 5000, symbol: "★★", classes: "border-amber-300 bg-amber-50 text-amber-950" },
] as const
export function patentProgress(confirmedPoints: number) {
  const points = Number.isFinite(confirmedPoints) ? Math.max(0, Math.floor(confirmedPoints)) : 0
  const index = rankingPatents.reduce((current,patent,i) => points >= patent.minimum ? i : current, 0)
  const patent = rankingPatents[index]
  const next = rankingPatents[index + 1] ?? null
  const earned = points - patent.minimum
  const needed = next ? next.minimum - patent.minimum : 0
  return { patent, next, points, remaining: next ? Math.max(0,next.minimum - points) : 0, progress: next ? Math.min(100, earned / needed * 100) : 100 }
}
