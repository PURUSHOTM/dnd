export type LabelId = "label1" | "label2" | "label3";

export type LabelPositions = Record<LabelId, number | null>;

const STORAGE_KEY = "dragdrop-label-positions";

export async function loadPositions(): Promise<LabelPositions> {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return {
			label1: 0,
			label2: 4,
			label3: 8,
		};
	}
	try {
		const parsed = JSON.parse(raw) as LabelPositions;
		return parsed;
	} catch {
		return {
			label1: 0,
			label2: 4,
			label3: 8,
		};
	}
}

export async function savePositions(positions: LabelPositions): Promise<void> {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
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


