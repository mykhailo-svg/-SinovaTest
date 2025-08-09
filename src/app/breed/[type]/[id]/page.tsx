import { Breed, BREED_TYPE } from "@/globalTypes";
import { fetchBreedImages, fetchBreedsByType } from "@/services/animals";
import Image from "next/image";

type BreedDetailProps = {
  params: Promise<{ type: BREED_TYPE; id: string }>;
};

export default async function BreedDetail({ params }: BreedDetailProps) {
  const { type: type, id } = await params;

  const breeds: Breed[] = await fetchBreedsByType(type as BREED_TYPE);

  const breed = breeds.find((b) => b.id.toString() === id);

  if (!breed) {
    return <p className="p-6">Breed not found.</p>;
  }

  const breedImages = await fetchBreedImages(type as BREED_TYPE, breed.id);

  const images = breedImages.map((img) => img.url);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{breed.name}</h1>
      {breed.description && <p className="mb-4">{breed.description}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={breed.name}
            width={400}
            height={300}
            className="rounded"
          />
        ))}
      </div>
    </div>
  );
}
