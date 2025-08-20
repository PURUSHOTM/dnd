export type LabelId = "label1" | "label2" | "label3";

export type LabelPositions = Record<LabelId, number | null>;

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export async function loadPositions(): Promise<LabelPositions> {
	try {
		const res = await fetch(`${API_BASE}/api/positions`);
		if (!res.ok) throw new Error("Failed to fetch");
		const data = (await res.json()) as LabelPositions;
		return data;
	} catch {
		return {
			label1: 0,
			label2: 4,
			label3: 8,
		};
	}
}

export async function savePositions(positions: LabelPositions): Promise<void> {
	await fetch(`${API_BASE}/api/positions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ positions }),
	});
}

export function getLabelText(labelId: LabelId): string {
	switch (labelId) {
		case "label1":
			return "Label 1";
		case "label2":
			return "Label 2";
		case "label3":
			return "Label 3";
	}
}

