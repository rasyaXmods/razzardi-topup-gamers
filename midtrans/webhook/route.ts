import { NextRequest,NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyMidtransSignature } from "@/lib/midtrans";

export const runtime="nodejs";
export async function POST(req:NextRequest){
 try{
  const payload=await req.json() as Record<string,unknown>;
  if(!verifyMidtransSignature(payload))return NextResponse.json({error:"Invalid signature"},{status:401});
  const invoice=String(payload.order_id??"");
  const transactionStatus=String(payload.transaction_status??"");
  const fraud=String(payload.fraud_status??"");
  const order=await db.order.findUnique({where:{midtransOrderId:invoice}});
  if(!order)return NextResponse.json({error:"Order not found"},{status:404});
  let status:"PENDING_PAYMENT"|"PAID"|"FAILED"|"EXPIRED"="PENDING_PAYMENT";
  if(transactionStatus==="settlement"||(transactionStatus==="capture"&&fraud==="accept"))status="PAID";
  else if(transactionStatus==="expire")status="EXPIRED";
  else if(["deny","cancel"].includes(transactionStatus))status="FAILED";
  await db.order.update({where:{id:order.id},data:{
    status,midtransTransactionId:String(payload.transaction_id??"")
  }});
  // Supplier fulfillment is intentionally not triggered until its official API contract is verified.
  return NextResponse.json({received:true});
 }catch(e){console.error("midtrans webhook",e);return NextResponse.json({error:"Webhook processing failed"},{status:500})}
}