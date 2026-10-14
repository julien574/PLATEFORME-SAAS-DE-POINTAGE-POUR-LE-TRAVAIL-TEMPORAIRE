"use client";

import { useState } from "react";
import { Bell, BriefcaseBusiness, Building2, Check, ChevronRight, Clock3, Download, LayoutDashboard, LockKeyhole, MapPin, Menu, Search, ShieldCheck, Sparkles, TriangleAlert, UsersRound } from "lucide-react";
import { activitySeed, demoOrganizations, missions, stats } from "@/lib/mock-data";
import type { TimesheetStatus } from "@/lib/workflow";

type Role = "interimaire" | "entreprise" | "agence" | "admin";
type PunchState = "avant" | "travail" | "pause" | "termine";

const roleLabels: Record<Role, string> = { interimaire: "Intérimaire", entreprise: "Responsable", agence: "Agence", admin: "Administration" };

export function DemoApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("interimaire");
  const [status, setStatus] = useState<TimesheetStatus>("BROUILLON");
  const [punch, setPunch] = useState<PunchState>("avant");
  const [activity, setActivity] = useState(activitySeed);
  const [toast, setToast] = useState("");

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const addActivity = (title: string, tone = "green") => {
    const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setActivity((items) => [{ time, title, meta: "Paul Martin · Maison Lenoir", tone }, ...items]);
    notify(title);
  };

  if (!authenticated) return <Login onLogin={(nextRole) => { setRole(nextRole); setAuthenticated(true); }} />;

  const shared = { role, setRole, status, setStatus, punch, setPunch, activity, addActivity, notify };
  return (
    <div className="app-shell">
      <Header role={role} setRole={setRole} onLogout={() => setAuthenticated(false)} />
      {role === "interimaire" && <WorkerView {...shared} />}
      {role === "entreprise" && <CompanyView {...shared} />}
      {role === "agence" && <AgencyView {...shared} />}
      {role === "admin" && <AdminView notify={notify} />}
      {toast && <div className="toast"><Check size={18} />{toast}</div>}
    </div>
  );
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [selectedRole, setSelectedRole] = useState<Role>("interimaire");
  return (
    <main className="login-page">
      <section className="login-brand">
        <Logo light />
        <div><span className="eyebrow light">Le temps, en toute confiance</span><h1>Chaque heure compte.<br />Chaque geste est simple.</h1><p>Le pointage pensé pour celles et ceux qui font avancer le travail temporaire.</p></div>
        <div className="trust-row"><ShieldCheck /><span>Données protégées</span><Clock3 /><span>Suivi en temps réel</span></div>
      </section>
      <section className="login-panel">
        <div className="demo-pill"><Sparkles size={15} /> Mode démonstration — aucun SMS envoyé</div>
        <div className="login-card">
          <span className="eyebrow">Bienvenue</span><h2>{step === "phone" ? "Connectez-vous en quelques secondes" : "Saisissez votre code"}</h2>
          <p>{step === "phone" ? "Choisissez votre profil puis indiquez votre numéro." : "Pour la démonstration, utilisez le code 123456."}</p>
          {step === "phone" ? <>
            <label>Profil de démonstration</label>
            <div className="role-grid">{(Object.keys(roleLabels) as Role[]).map((item) => <button key={item} className={selectedRole === item ? "role active" : "role"} onClick={() => setSelectedRole(item)}>{roleLabels[item]}</button>)}</div>
            <label htmlFor="phone">Numéro de téléphone</label><div className="phone-input"><span>🇫🇷 +33</span><input id="phone" defaultValue="6 12 34 56 78" /></div>
            <button className="primary wide" onClick={() => setStep("code")}>Recevoir mon code <ChevronRight size={18} /></button>
          </> : <>
            <label htmlFor="otp">Code à 6 chiffres</label><input id="otp" className="otp" inputMode="numeric" defaultValue="123456" maxLength={6} />
            <button className="primary wide" onClick={() => onLogin(selectedRole)}>Accéder à mon espace <ChevronRight size={18} /></button>
            <button className="link-button" onClick={() => setStep("phone")}>Modifier le numéro</button>
          </>}
        </div>
      </section>
    </main>
  );
}

function Logo({ light = false }: { light?: boolean }) { return <div className={`logo ${light ? "light" : ""}`}><span className="logo-mark">t.</span><span>tempo</span></div>; }

function Header({ role, setRole, onLogout }: { role: Role; setRole: (role: Role) => void; onLogout: () => void }) {
  return <header className="topbar"><Logo /><nav>{(Object.keys(roleLabels) as Role[]).map((item) => <button key={item} className={role === item ? "active" : ""} onClick={() => setRole(item)}>{roleLabels[item]}</button>)}</nav><div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={20} /><i /></button><button className="avatar" onClick={onLogout} title="Se déconnecter">PM</button><Menu className="mobile-menu" /></div></header>;
}

type SharedProps = {
  status: TimesheetStatus; setStatus: (s: TimesheetStatus) => void; punch: PunchState; setPunch: (s: PunchState) => void;
  activity: typeof activitySeed; addActivity: (title: string, tone?: string) => void; notify: (message: string) => void;
};

function WorkerView({ status, setStatus, punch, setPunch, addActivity, notify }: SharedProps) {
  const config = {
    avant: { label: "Pointer mon arrivée", next: "travail" as PunchState, event: "Paul a pointé son arrivée" },
    travail: { label: "Début de pause", next: "pause" as PunchState, event: "Paul a débuté sa pause" },
    pause: { label: "Fin de pause", next: "travail" as PunchState, event: "Paul a repris son poste" },
    termine: { label: "Journée terminée", next: "termine" as PunchState, event: "" },
  }[punch];
  const punchAction = () => { if (punch === "termine") return; setPunch(config.next); addActivity(config.event, punch === "pause" ? "amber" : "green"); };
  const leave = () => { setPunch("termine"); addActivity("Paul a pointé son départ"); };
  return <main className="worker-page">
    <div className="worker-welcome"><span>Mercredi 14 octobre</span><h1>Bonjour Paul 👋</h1><p>Votre mission du jour est prête.</p></div>
    <section className="mission-card">
      <div className="mission-head"><div><span className="eyebrow">Mission du jour</span><h2>Maison Lenoir</h2><p><MapPin size={16} /> Atelier République · Lyon 3e</p></div><span className="status live">● En cours</span></div>
      <div className="schedule"><div><small>Horaires prévus</small><strong>08:00 — 17:00</strong></div><div><small>Poste</small><strong>Agent de production</strong></div></div>
      <div className="timer"><span>Temps travaillé aujourd’hui</span><strong>{punch === "avant" ? "0h00" : punch === "termine" ? "7h48" : "2h34"}</strong><small>Objectif : 8h00</small></div>
      <button className="punch-button" onClick={punchAction} disabled={punch === "termine"}><Clock3 />{config.label}</button>
      {(punch === "travail") && <button className="secondary wide" onClick={leave}>Pointer mon départ</button>}
      <p className="gps-note"><MapPin size={14} /> Géolocalisation désactivée pour cette mission</p>
    </section>
    <section className="week-card"><div><span className="eyebrow">Semaine 42</span><h2>Mon relevé</h2></div><strong>24h48</strong><div className="week-row"><span>Lun<strong>8h00</strong></span><span>Mar<strong>9h00</strong></span><span className="today">Mer<strong>7h48</strong></span><span>Jeu<strong>—</strong></span><span>Ven<strong>—</strong></span></div><div className="actions"><button className="secondary" onClick={() => { addActivity("Paul a demandé une correction", "red"); notify("Demande de correction enregistrée"); }}>Signaler une correction</button><button className="primary" disabled={status !== "BROUILLON"} onClick={() => { setStatus("SOUMIS"); addActivity("Paul a soumis son relevé"); }}>Soumettre mon relevé</button></div><StatusTrail status={status} /></section>
  </main>;
}

function StatusTrail({ status }: { status: TimesheetStatus }) {
  const steps: TimesheetStatus[] = ["BROUILLON", "SOUMIS", "VALIDÉ ENTREPRISE", "VERROUILLÉ"];
  const current = status === "VALIDÉ AGENCE" ? 3 : Math.max(0, steps.indexOf(status));
  return <div className="status-trail">{steps.map((step, index) => <div key={step} className={index <= current ? "done" : ""}><i>{index < current ? <Check size={12} /> : index + 1}</i><span>{step.toLowerCase()}</span></div>)}</div>;
}

function CompanyView({ status, setStatus, addActivity, notify }: SharedProps) {
  return <Dashboard title="Bonjour Sophie" subtitle="Atelier République · Maison Lenoir" side="entreprise">
    <div className="hero-row"><div><span className="eyebrow">Aujourd’hui</span><h1>Votre équipe en un coup d’œil</h1></div><button className="primary" onClick={() => notify("Tous les relevés éligibles ont été traités")}>Valider la sélection <Check size={17} /></button></div>
    <div className="mini-stats"><Stat value="12" label="Intérimaires prévus" /><Stat value="9" label="Actuellement présents" /><Stat value="2" label="Relevés à valider" accent /><Stat value="1" label="Anomalie" warn /></div>
    <section className="panel"><div className="panel-title"><div><span className="eyebrow">Relevés hebdomadaires</span><h2>À vérifier</h2></div><button className="filter"><Search size={17} /> Rechercher</button></div><div className="table-wrap"><table><thead><tr><th>Intérimaire</th><th>Mission</th><th>Semaine</th><th>Total</th><th>Statut</th><th></th></tr></thead><tbody>{missions.slice(0,3).map((mission, index) => <tr key={mission.name}><td><Person mission={mission} /></td><td>{mission.company}<small>{mission.site}</small></td><td>12–18 oct.</td><td><strong>{index === 1 ? "35h00" : "39h48"}</strong></td><td><span className={`status ${index === 2 ? "alert" : "pending"}`}>{index === 2 ? "Correction" : status}</span></td><td>{index === 0 && status === "SOUMIS" ? <button className="table-action" onClick={() => { setStatus("VALIDÉ ENTREPRISE"); addActivity("Relevé de Paul validé par l’entreprise"); }}>Valider <Check size={15} /></button> : <button className="icon-button"><ChevronRight size={18} /></button>}</td></tr>)}</tbody></table></div></section>
  </Dashboard>;
}

function AgencyView({ status, setStatus, activity, addActivity, notify }: SharedProps) {
  return <Dashboard title="Vue d’ensemble" subtitle="Intérim Plus · Mise à jour en temps réel" side="agence">
    <div className="hero-row"><div><span className="eyebrow">Mercredi 14 octobre 2026</span><h1>Bonjour, Marie</h1></div><button className="secondary"><Download size={17} /> Exporter les heures</button></div>
    <div className="agency-layout"><div><div className="stat-grid">{stats.map((stat, index) => <div className="stat-card" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small className={index === 3 ? "danger" : ""}>{stat.delta}</small></div>)}</div><section className="panel"><div className="panel-title"><div><span className="eyebrow">Suivi opérationnel</span><h2>Missions en cours</h2></div><button className="filter">Tous les statuts</button></div><div className="table-wrap"><table><thead><tr><th>Intérimaire</th><th>Entreprise & site</th><th>Horaires</th><th>Statut</th><th></th></tr></thead><tbody>{missions.map((mission) => <tr key={mission.name}><td><Person mission={mission} /></td><td>{mission.company}<small>{mission.site}</small></td><td>{mission.time}</td><td><span className={`status ${mission.status.includes("manquant") ? "alert" : "live"}`}>{mission.status}</span></td><td><ChevronRight size={18} /></td></tr>)}</tbody></table></div></section></div>
    <aside className="activity-panel"><div className="panel-title"><div><span className="eyebrow">En direct</span><h2>Activité</h2></div><span className="live-dot">● Live</span></div><div className="activity-list">{activity.slice(0,6).map((item, index) => <div className="activity" key={`${item.time}-${index}`}><i className={item.tone} /><div><time>{item.time}</time><strong>{item.title}</strong><small>{item.meta}</small></div></div>)}</div>{status === "VALIDÉ ENTREPRISE" && <button className="primary wide" onClick={() => { setStatus("VALIDÉ AGENCE"); addActivity("Relevé de Paul validé par l’agence"); window.setTimeout(() => setStatus("VERROUILLÉ"), 300); }}>Valider définitivement</button>}<button className="link-button" onClick={() => notify("Flux actualisé")}>Voir tout le journal</button></aside></div>
  </Dashboard>;
}

function AdminView({ notify }: { notify: (s: string) => void }) {
  return <Dashboard title="Administration" subtitle="Pilotage de la plateforme" side="admin"><div className="hero-row"><div><span className="eyebrow">Administration plateforme</span><h1>Organisations & accès</h1><p>L’accès exceptionnel aux données métier n’est jamais automatique.</p></div><button className="primary" onClick={() => notify("Invitation simulée — aucun message envoyé")}>Inviter un utilisateur</button></div><div className="mini-stats"><Stat value="5" label="Organisations" /><Stat value="4" label="Établissements" /><Stat value="18" label="Utilisateurs" /><Stat value="100 %" label="Services opérationnels" /></div><div className="admin-grid"><section className="panel"><div className="panel-title"><div><span className="eyebrow">Répertoire</span><h2>Organisations</h2></div></div>{demoOrganizations.agencies.map((name) => <OrgRow key={name} name={name} type="Agence d’intérim" icon={<BriefcaseBusiness />} />)}{demoOrganizations.companies.map((name) => <OrgRow key={name} name={name} type="Entreprise utilisatrice" icon={<Building2 />} />)}</section><section className="security-card"><LockKeyhole /><span className="eyebrow light">Sécurité</span><h2>Accès exceptionnel encadré</h2><p>Un administrateur doit fournir un motif, une durée et une autorisation avant tout accès aux données d’une mission.</p><button onClick={() => notify("Procédure d’accès consultée")}>Voir la procédure</button></section></div></Dashboard>;
}

function Dashboard({ children, title, subtitle, side }: { children: React.ReactNode; title: string; subtitle: string; side: Role }) { return <div className="dashboard"><aside className="sidebar"><div><span className="context-label">Votre espace</span><strong>{title}</strong><small>{subtitle}</small></div><div className="side-links"><button className="active"><LayoutDashboard />Tableau de bord</button><button><UsersRound />Équipe</button><button><BriefcaseBusiness />Missions</button><button><Clock3 />Relevés</button>{side === "agence" && <button><TriangleAlert />Anomalies</button>}<button><ShieldCheck />Autorisations</button></div><div className="support"><strong>Besoin d’aide ?</strong><small>Notre équipe vous accompagne.</small><button>Centre d’aide</button></div></aside><main className="dashboard-main">{children}</main></div>; }
function Stat({ value, label, accent, warn }: { value: string; label: string; accent?: boolean; warn?: boolean }) { return <div className={`mini-stat ${accent ? "accent" : ""} ${warn ? "warn" : ""}`}><strong>{value}</strong><span>{label}</span></div>; }
function Person({ mission }: { mission: typeof missions[number] }) { return <div className="person"><i>{mission.initials}</i><strong>{mission.name}</strong></div>; }
function OrgRow({ name, type, icon }: { name: string; type: string; icon: React.ReactNode }) { return <div className="org-row"><i>{icon}</i><div><strong>{name}</strong><small>{type}</small></div><span>Actif</span><ChevronRight /></div>; }
