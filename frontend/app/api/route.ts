import { NextApiRequest, NextApiResponse } from "next";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.LOG_TOKEN;
  if(!token){
    return Response.json({error: 'Token is not available'})
  }
  return Response.json({token})
}