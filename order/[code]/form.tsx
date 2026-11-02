 "use client";
import { useState } from "react";
export default function OrderForm({code}:{code:string}) {
 const [playerId,setPlayerId]=useState(""); const [serverId,setServerId]=useState("");
 const [email,setEmail]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");
  try{const r=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,playerId,serverId,email})});
   const d=await r.json(); if(!r.ok)throw new Error(d.error||"Checkout gagal");
   window.location.href=d.redirectUrl;
  }catch(x){setError(x instanceof Error?x.message:"Terjadi kesalahan");setBusy(false)}
 }
 return <form className="form" onSubmit={submit}>
  <label>User ID<input required value={playerId} onChange={e=>setPlayerId(e.target.value)} maxLength={80} placeholder="Masukkan User ID"/></label>
  <label>Server ID (jika diperlukan)<input value={serverId} onChange={e=>setServerId(e.target.value)} maxLength={40} placeholder="Masukkan Server ID"/></label>
  <label>Email untuk bukti transaksi<input type="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={160} placeholder="nama@email.com"/></label>
  {error&&<div className="notice">{error}</div>}
  <button className="btn" disabled={busy}>{busy?"Memproses...":"Lanjut ke pembayaran"}</button>
  <p className="muted">Pastikan User ID dan Server ID benar sebelum membayar.</p>
 </form>
}