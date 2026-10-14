import { describe, expect, it } from "vitest";
import { canTransition, transition, workedMinutes } from "./workflow";

describe("calcul des heures", () => {
  it("calcule 8h pour 08h-17h avec une heure de pause", () => {
    expect(workedMinutes([
      { type: "ARRIVEE", at: "2026-10-14T08:00:00+02:00" },
      { type: "PAUSE_DEBUT", at: "2026-10-14T12:00:00+02:00" },
      { type: "PAUSE_FIN", at: "2026-10-14T13:00:00+02:00" },
      { type: "DEPART", at: "2026-10-14T17:00:00+02:00" },
    ])).toBe(480);
  });

  it("gère une vacation de nuit avec 30 minutes de pause", () => {
    expect(workedMinutes([
      { type: "ARRIVEE", at: "2026-10-14T22:00:00+02:00" },
      { type: "PAUSE_DEBUT", at: "2026-10-15T01:00:00+02:00" },
      { type: "PAUSE_FIN", at: "2026-10-15T01:30:00+02:00" },
      { type: "DEPART", at: "2026-10-15T06:00:00+02:00" },
    ])).toBe(450);
  });

  it("gère plusieurs pauses", () => {
    expect(workedMinutes([
      { type: "ARRIVEE", at: "2026-10-14T08:00:00Z" },
      { type: "PAUSE_DEBUT", at: "2026-10-14T10:00:00Z" },
      { type: "PAUSE_FIN", at: "2026-10-14T10:15:00Z" },
      { type: "PAUSE_DEBUT", at: "2026-10-14T12:00:00Z" },
      { type: "PAUSE_FIN", at: "2026-10-14T12:45:00Z" },
      { type: "DEPART", at: "2026-10-14T17:00:00Z" },
    ])).toBe(480);
  });
});

describe("circuit de validation", () => {
  it("accepte le parcours nominal", () => {
    expect(transition("BROUILLON", "SOUMIS")).toBe("SOUMIS");
    expect(canTransition("SOUMIS", "VALIDÉ ENTREPRISE")).toBe(true);
    expect(canTransition("VALIDÉ ENTREPRISE", "VALIDÉ AGENCE")).toBe(true);
  });
  it("refuse une validation agence prématurée", () => {
    expect(() => transition("SOUMIS", "VALIDÉ AGENCE")).toThrow("Transition impossible");
  });
  it("verrouille une validation finale", () => {
    expect(canTransition("VALIDÉ AGENCE", "VERROUILLÉ")).toBe(true);
    expect(canTransition("VERROUILLÉ", "BROUILLON")).toBe(false);
  });
});
