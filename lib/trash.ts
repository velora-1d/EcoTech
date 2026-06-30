export const trashCategories = [
  {
    key: "organic",
    label: "Organik",
    description: "Sisa makanan, daun, dan bahan organik.",
    pointsPerItem: 20
  },
  {
    key: "plastic",
    label: "Plastik",
    description: "Botol, gelas plastik, dan kemasan PET.",
    pointsPerItem: 40
  },
  {
    key: "paper",
    label: "Kertas",
    description: "Kertas kering, kardus, dan koran.",
    pointsPerItem: 25
  },
  {
    key: "metal",
    label: "Metal",
    description: "Kaleng, aluminium, dan besi.",
    pointsPerItem: 50
  },
  {
    key: "fabric",
    label: "Kain",
    description: "Baju bekas, kain, dan tekstil.",
    pointsPerItem: 30
  }
] as const;

export type TrashCategoryKey = (typeof trashCategories)[number]["key"];

export function getPointsPerItem(categoryKey: string) {
  return trashCategories.find((category) => category.key === categoryKey)?.pointsPerItem ?? 0;
}
