import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tempo — Pointage intérimaire",
    short_name: "Tempo",
    description: "Pointage et validation des heures intérimaires",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#102e2c",
    icons: [],
  };
}
