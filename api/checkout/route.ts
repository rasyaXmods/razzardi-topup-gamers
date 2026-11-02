import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSnapTransaction } from "@/lib/midtrans";

export const runtime = "nodejs";
const schema=z.object({
 code:z.string().min(1).max(80), playerId:z.string().trim().min(1).max(80),
 serverId:z.string().trim().max(40).optional(), email:z.string().email().max(160).optional().or(z.literal(""))
});
export async function POST(req:NextRequest){
 try{
  const parsed=schema.safeParse(await req.json());
  if(!parsed.success)return NextResponse.json({error:"Data pesanan tidak valid."},{status:400});
  const {code,playerId,serverId,email}=parsed.data;
  const product=await db.product.findUnique({where:{code,active:true}});
  if(!product)return NextResponse.json({error:"Produk tidak ditemukan atau tidak aktif."},{status:404});
  const invoice=`RZ-${Date.now()}-${crypto.randomUUID().slice(0,8)}`;
  const order=await db.order.create({data:{
   invoice,productId:product.id,playerId,serverId:serverId||null,
   customerEmail:email||null,amount:product.price,status:"PENDING_PAYMENT",midtransOrderId:invoice
  }});
  try{
   const snap=await createSnapTransaction({orderId:invoice,amount:product.price,productName:product.name,playerId,email:email||undefined});
   return NextResponse.json({orderId:order.invoice,redirectUrl:snap.redirectUrl});
  }catch(e){
   await db.order.update({where:{id:order.id},data:{status:"FAILED",failureReason:e instanceof Error?e.message:"Payment initialization failed"}});
   throw e;
  }
 }catch(e){console.error("checkout error",e);return NextResponse.json({error:"Checkout belum dapat diproses. Periksa konfigurasi pembayaran dan database."},{status:503})}
}