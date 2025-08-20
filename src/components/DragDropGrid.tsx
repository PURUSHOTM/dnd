import { useEffect, useMemo, useState } from "react";
import type { LabelId, LabelPositions } from "../services/positionStore";
import { getLabelText, loadPositions, savePositions } from "../services/positionStore";

type DropEvent = React.DragEvent<HTMLDivElement>;

const ROW_TITLES = ["Date", "Name", "Car"];
const TOTAL_SLOTS = 9; // 3 x 3

function classNames(...names: Array<string | false | undefined>): string {
  return names.filter(Boolean).join(" ");
}

export default function DragDropGrid() {
  const [positions, setPositions] = useState<LabelPositions>({
    label1: 0,
    label2: 4,
    label3: 8,
  });

  useEffect(() => {
    (async () => {
      const stored = await loadPositions();
      setPositions(stored);
    })();
  }, []);

  const slotToLabel: Record<number, LabelId | null> = useMemo(() => {
    const mapping: Record<number, LabelId | null> = {} as Record<number, LabelId | null>;
    for (let i = 0; i < TOTAL_SLOTS; i += 1) mapping[i] = null;
    (Object.keys(positions) as Array<LabelId>).forEach((labelId) => {
      const slotIndex = positions[labelId];
      if (slotIndex !== null && slotIndex >= 0) {
        mapping[slotIndex] = labelId;
      }
    });
    return mapping;
  }, [positions]);

  function onDragStart(labelId: LabelId, event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", labelId);
    event.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(event: DropEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  async function onDrop(slotIndex: number, event: DropEvent) {
    event.preventDefault();
    const labelId = event.dataTransfer.getData("text/plain") as LabelId;
    if (!labelId) return;

    setPositions((prev) => {
      const updated: LabelPositions = { ...prev };

      const currentSlotForDragged = updated[labelId];
      const labelCurrentlyInTarget = Object.entries(updated).find(([, idx]) => idx === slotIndex)?.[0] as LabelId | undefined;

      if (labelCurrentlyInTarget && labelCurrentlyInTarget !== labelId) {
        // swap
        updated[labelId] = slotIndex;
        updated[labelCurrentlyInTarget] = currentSlotForDragged;
      } else {
        updated[labelId] = slotIndex;
      }

      // persist
      void savePositions(updated);
      return updated;
    });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 text-left text-sm text-gray-600">
        Drag any label and drop into any of the nine blue slots. Positions persist in local storage.
      </div>

      <div className="grid grid-cols-[120px_repeat(3,_1fr)] gap-0 text-left">
        {/* Header row for columns (empty corner cell + 3 column labels) */}
        <div></div>
        <div className="p-2 text-sm font-medium text-gray-700">Col 1</div>
        <div className="p-2 text-sm font-medium text-gray-700">Col 2</div>
        <div className="p-2 text-sm font-medium text-gray-700">Col 3</div>

        {ROW_TITLES.map((rowTitle, rowIdx) => (
          <>
            <div key={`title-${rowTitle}`} className="border border-gray-300 p-3 font-semibold">
              {rowTitle}
            </div>
            {Array.from({ length: 3 }).map((_, colIdx) => {
              const slotIndex = rowIdx * 3 + colIdx;
              const labelInSlot = slotToLabel[slotIndex];
              return (
                <div
                  key={`cell-${rowIdx}-${colIdx}`}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(slotIndex, e)}
                  className={classNames(
                    "h-16 border border-gray-300",
                    "bg-blue-100/60 flex items-center justify-center",
                  )}
                >
                  {labelInSlot ? (
                    <div
                      draggable
                      onDragStart={(e) => onDragStart(labelInSlot, e)}
                      className="cursor-grab select-none rounded bg-blue-500 px-3 py-1 text-white shadow"
                    >
                      {getLabelText(labelInSlot)}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}


