import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await db.product.findMany({
    where: { active: true }, orderBy: [{ game: "asc" }, { price: "asc" }]
  }).catch(() => []);
  return <main className="wrap">
    <nav className="nav"><div className="brand">⚡ RAZZARDI STORE</div><span className="pill">TOP UP • DIGITAL</span></nav>
    <section className="hero">
      <div className="eyebrow">FAST • SIMPLE • SECURE</div>
      <h1>TOP UP GAME<br/><span style={{color:"#b88cff"}}>TANPA RIBET.</span></h1>
      <p>Isi ulang game favorit melalui proses pemesanan online. Pembayaran diproses melalui Midtrans.</p>
      <a className="btn" href="#katalog" style={{display:"inline-block",marginTop:10}}>Lihat katalog</a>
    </section>
    <section id="katalog" style={{paddingTop:28}}>
      <h2>Pilih produk game</h2>
      {products.length === 0 ? <div className="notice">Katalog belum tersedia. Admin perlu memasukkan produk dan harga supplier yang sudah diverifikasi sebelum produk ditampilkan.</div> :
        <div className="grid">{products.map(p=><article className="card" key={p.id}>
          <div className="tag">{p.game}</div><h3>{p.name}</h3>
          <p className="muted">Rp {p.price.toLocaleString("id-ID")}</p>
          <a className="btn" href={`/order/${p.code}`} style={{display:"inline-block"}}>Beli sekarang</a>
        </article>)}</div>}
    </section>
    <div className="footer">© {new Date().getFullYear()} RAZZARDI STORE</div>
  </main>;
}