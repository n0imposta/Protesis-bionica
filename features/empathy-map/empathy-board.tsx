"use client";

import { motion } from "framer-motion";

const zones = [
  { key: "thinks", title: "Piensa" },
  { key: "feels", title: "Siente" },
  { key: "says", title: "Dice" },
  { key: "does", title: "Hace" },
  { key: "pains", title: "Dolores" },
  { key: "needs", title: "Necesidades" },
];

export function EmpathyBoard({ notes }: { notes: Array<{ id: string; zone: string; content: string }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {zones.map((zone, index) => (
        <motion.section
          key={zone.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="glass-panel min-h-64 rounded-lg p-5"
        >
          <h2 className="font-semibold text-white">{zone.title}</h2>
          <div className="mt-4 space-y-3">
            {notes.filter((note) => note.zone === zone.key).map((note) => (
              <div key={note.id} className="rotate-[-1deg] rounded-md border border-amber-200/20 bg-amber-200/12 p-3 text-sm leading-6 text-amber-50 shadow-lg">
                {note.content}
              </div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
