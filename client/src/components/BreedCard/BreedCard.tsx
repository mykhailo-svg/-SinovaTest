import Link from "next/link";

interface BreedCardProps {
  id: string;
  name: string;
  image: string;
  type: "dog" | "cat";
}

export const BreedCard = ({ id, name, image, type }: BreedCardProps) => (
  <Link href={`/breed/${type}/${id}`}>
    <div className="rounded-lg shadow-md p-4 hover:shadow-xl transition">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="mt-2 text-lg font-semibold text-center">{name}</h2>
    </div>
  </Link>
);
