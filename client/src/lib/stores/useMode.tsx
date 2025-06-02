
import { create } from "zustand";

export type Mode = "build" | "control" | "auto";

interface ModeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useMode = create<ModeState>((set) => ({
  mode: "build",
  setMode: (mode) => set({ mode }),
}));
