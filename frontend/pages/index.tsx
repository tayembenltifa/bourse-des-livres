import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, fetcher);

  if (error) return <div>Erreur chargement</div>;
  if (!data) return <div>Chargement …</div>;

  return (
    <main style={{ padding: 20 }}>
      <h1>Bourse des Livres</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr)))"}}> 
        {data.books.map((b: any) => (
          <div key={b.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
            <div style={{ height: 140, background: "#f6f6f6", marginBottom: 8 }} />
            <h3>{b.title}</h3>
            <p style={{ margin: 0 }}>{b.author}</p>
            <p style={{ fontWeight: "bold" }}>{(b.price_cents/100).toFixed(2)} {b.currency}</p>
            <a href={`/book/${b.id}`}>Voir l'annonce</a>
          </div>
        ))}
      </div>
    </main>
  );
}