export const stats = [
  { label: "Missions aujourd’hui", value: "42", delta: "+6 cette semaine" },
  { label: "Présents", value: "31", delta: "74 % des attendus" },
  { label: "À valider", value: "8", delta: "3 prioritaires" },
  { label: "Anomalies", value: "3", delta: "À contrôler" },
];

export const missions = [
  { name: "Paul Martin", company: "Maison Lenoir", site: "Atelier République", time: "08:00 – 17:00", status: "En poste", initials: "PM" },
  { name: "Inès Bernard", company: "Logisphère", site: "Entrepôt Nord", time: "06:00 – 14:00", status: "Pause", initials: "IB" },
  { name: "Karim Diallo", company: "Maison Lenoir", site: "Atelier République", time: "09:00 – 18:00", status: "À valider", initials: "KD" },
  { name: "Chloé Petit", company: "Nova Services", site: "Siège Lyon", time: "08:30 – 16:30", status: "Départ manquant", initials: "CP" },
];

export const activitySeed = [
  { time: "10:32", title: "Inès a débuté sa pause", meta: "Logisphère · Entrepôt Nord", tone: "amber" },
  { time: "09:04", title: "Karim a pointé son arrivée", meta: "Maison Lenoir · Atelier République", tone: "green" },
  { time: "08:58", title: "Correction demandée par Chloé", meta: "Départ du 13 octobre · Motif renseigné", tone: "red" },
  { time: "08:02", title: "Paul a pointé son arrivée", meta: "Maison Lenoir · Atelier République", tone: "green" },
];

export const demoOrganizations = {
  agencies: ["Intérim Plus", "Tempo Rhône"],
  companies: ["Maison Lenoir", "Logisphère", "Nova Services"],
  establishments: ["Atelier République", "Entrepôt Nord", "Siège Lyon", "Atelier Croix-Rousse"],
  workers: ["Paul Martin", "Inès Bernard", "Karim Diallo", "Chloé Petit", "Nora Robert", "Lucas Simon", "Sofia Leroy", "Hugo Moreau", "Emma Roux", "Yanis Fournier"],
};
