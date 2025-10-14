import { useState } from "react";

export default function useProjects() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Situbondo 01", location: "Situbondo" },
    { id: 2, name: "Situbondo 02", location: "Situbondo" },
    { id: 3, name: "Semarang Sky Piercer", location: "Semarang" },
  ]);

  const postProjects = async (newProject: { name: string; location: string }) => {
    // simulasi delay biar realistis
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProjects((prev) => [
          ...prev,
          {
            id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
            ...newProject,
          },
        ]);
        resolve();
      }, 300);
    });
  };

  // === UPDATE ===
  const putProjects = async (updated: { id: number; name: string; location: string }) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === updated.id ? { ...proj, ...updated } : proj
          )
        );
        resolve();
      }, 300);
    });
  };

  // === DELETE ===
  const deleteProjects = async (id: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
        resolve();
      }, 300);
    });
  };

  return {
    projects,
    setProjects,
    postProjects,
    putProjects,
    deleteProjects,
  };
}
