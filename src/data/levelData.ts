export interface LevelData {
	id: string;
	name: string;
	mapKey: string;
	locked?: boolean;
}

export const LEVELS: LevelData[] = [
	{
		id: "level1",
		name: "Forêt verdoyante",
		mapKey: "forest_level",
	},
	{
		id: "level2",
		name: "Grottes humides",
		mapKey: "cave_level",
		locked: true,
	},
	{
		id: "level3",
		name: "Montagnes gelées",
		mapKey: "ice_level",
		locked: true,
	},
];
