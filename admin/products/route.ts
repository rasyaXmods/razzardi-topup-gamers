import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
export const runtime="nodejs";
function authorized(req:NextRequest){const token=process.env.ADMIN_API_TOKEN;return !!token&&req.headers.get("authorization")==="Bearer "+token}
const schema=z.object({code:z.string().min(2).max(80),game:z.string().min(2).max(80),name:z.string().min(2).max(120),price:z.number().int().positive(),active:z.boolean().default(false)});
export async function GET(req:NextRequest){
 if(!authorized(req))return NextResponse.json({error:"Unauthorized"},{status:401});
 const products=await db.product.findMany({orderBy:{createdAt:"desc"}});
 return NextResponse.json(products);
}
export async function POST(req:NextRequest){
 if(!authorized(req))return NextResponse.json({error:"Unauthorized"},{status:401});
 const parsed=schema.safeParse(await req.json());
 if(!parsed.success)return NextResponse.json({error:"Data produk tidak valid"},{status:400});
 const product=await db.product.upsert({where:{code:parsed.data.code},create:parsed.data,update:parsed.data});
 return NextResponse.json(product);
}