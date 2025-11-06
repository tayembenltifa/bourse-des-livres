import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}` : null, fetcher);

  if (error) return <div>Erreur</div>;
  if (!data) return <div>Chargement …</div>;

  const { book, images } = data;
  return (
    <main style={{ padding: 20 }}>
      <h1>{book.title}</h1>
      <p><strong>Auteur:</strong> {book.author}</p>
      <p><strong>Prix:</strong> {(book.price_cents/100).toFixed(2)} {book.currency}</p>
      <p><strong>État:</strong> {book.condition}</p>
      <p>{book.description}</p>
    </main>
  );
}