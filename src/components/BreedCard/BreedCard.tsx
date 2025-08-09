import type { FormattedBreed } from "@/globalTypes";
import Link from "next/link";

const IMAGE_PLACEHOLDER =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3hTQwsrGuYW0XGXbIB4d2noVL1ZhL7llERA&s";

export const BreedCard = ({ id, name, image, type }: FormattedBreed) => (
  <Link href={`/breed/${type}/${id}`}>
    <div className="rounded-lg shadow-md p-4 hover:shadow-xl transition">
      {/* eslint-disable-next-line */}
      <img
        src={image || IMAGE_PLACEHOLDER}
        alt={name}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="mt-2 text-lg font-semibold text-center">{name}</h2>
    </div>
  </Link>
);
