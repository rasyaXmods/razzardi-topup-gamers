import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{invoice:string}>}){
 const {invoice}=await params;
 const order=await db.order.findUnique({where:{invoice},select:{invoice:true,status:true,amount:true,createdAt:true}});
 if(!order)return NextResponse.json({error:"Pesanan tidak ditemukan"},{status:404});
 return NextResponse.json(order);
}