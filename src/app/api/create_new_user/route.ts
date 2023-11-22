import { createUser } from "@/firebase/createFirebaseUser";
import { NextRequest, NextResponse } from "next/server"
import {v4 as uuid} from 'uuid'





export async function POST(request: Request){
    try{

        const {email, password} = await request.json()
        const uid = uuid();

     console.log('email', email, '00000000000000000000000000000000')
        // Call the createUser function to create a new user
        createUser(uid, email, password)
            .then((userRecord) => {
                console.log('Successfully created new user:', userRecord.email)
                return NextResponse.json({"message": "Account created successfully"}, {
                    status: 200,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                })
            })
            .catch((error) => {
                console.log('Error creating new user: 00000000000', error);
                return NextResponse.json({message: error?.message}, {status: 400})
            })
       
    }
    catch(e){
        return NextResponse.json({message: 'Something Went Wrong '}, {status: 500})
    }
}


export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  
  export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { headers: corsHeaders });
  }