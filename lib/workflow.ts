export type TimesheetStatus = "BROUILLON" | "SOUMIS" | "VALIDÉ ENTREPRISE" | "VALIDÉ AGENCE" | "CORRECTION DEMANDÉE" | "VERROUILLÉ";

const transitions: Record<TimesheetStatus, TimesheetStatus[]> = {
  BROUILLON: ["SOUMIS"],
  SOUMIS: ["VALIDÉ ENTREPRISE", "CORRECTION DEMANDÉE"],
  "VALIDÉ ENTREPRISE": ["VALIDÉ AGENCE", "CORRECTION DEMANDÉE"],
  "VALIDÉ AGENCE": ["VERROUILLÉ"],
  "CORRECTION DEMANDÉE": ["BROUILLON", "SOUMIS"],
  VERROUILLÉ: [],
};

export function canTransition(from: TimesheetStatus, to: TimesheetStatus) {
  return transitions[from].includes(to);
}

export function transition(from: TimesheetStatus, to: TimesheetStatus) {
  if (!canTransition(from, to)) throw new Error(`Transition impossible : ${from} → ${to}`);
  return to;
}

export type TimeEvent = { type: "ARRIVEE" | "PAUSE_DEBUT" | "PAUSE_FIN" | "DEPART"; at: string };

export function workedMinutes(events: TimeEvent[]) {
  let start: number | null = null;
  let pause: number | null = null;
  let total = 0;
  for (const event of [...events].sort((a, b) => Date.parse(a.at) - Date.parse(b.at))) {
    const at = Date.parse(event.at);
    if (event.type === "ARRIVEE") start = at;
    if (event.type === "PAUSE_DEBUT" && start !== null) { total += at - start; start = null; pause = at; }
    if (event.type === "PAUSE_FIN" && pause !== null) { start = at; pause = null; }
    if (event.type === "DEPART" && start !== null) { total += at - start; start = null; }
  }
  return Math.round(total / 60000);
}

export function formatMinutes(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${hours}h${String(minutes).padStart(2, "0")}`;
}
