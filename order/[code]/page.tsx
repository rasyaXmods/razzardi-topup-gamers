import { db } from "@/lib/db";
import OrderForm from "./form";

export const dynamic = "force-dynamic";
export default async function OrderPage({ params }: { params: Promise<{code:string}> }) {
  const {code}=await params;
  const product=await db.product.findUnique({where:{code}});
  if(!product || !product.active) return <main className="wrap"><a href="/">← Kembali</a><h1>Produk tidak tersedia</h1></main>;
  return <main className="wrap"><a href="/">← RAZZARDI STORE</a><section className="card" style={{marginTop:22}}>
    <div className="tag">{product.game}</div><h1>{product.name}</h1>
    <h2>Rp {product.price.toLocaleString("id-ID")}</h2>
    <OrderForm code={product.code}/>
  </section></main>;
}