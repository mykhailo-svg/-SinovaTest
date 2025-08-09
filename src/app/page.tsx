import { BreedsList } from "@/components/BreedsList";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🐾 Pet Breed Explorer
      </h1>

      <BreedsList />
    </main>
  );
}
