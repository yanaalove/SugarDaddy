import { NextResponse } from "next/server"
import prisma from "../../../lip/prisma"

export async function POST(req: Request) {
    try {
      console.log("API /api/mining triggered")
  
      const body = await req.json()
      console.log("Request body received:", body)
  
      const { user_id, points } = body
  
      console.log("Received user_id:", user_id)
      console.log("Received points:", points)
  
      if (!user_id || points == null) {
        console.error("Missing required data")
        return NextResponse.json(
          { error: "Missing required data" },
          { status: 400 }
        )
      }
  
      const user = await prisma.user.findUnique({
        where: { user_id },
      })
      console.log("Prisma user query result:", user)
  
      if (!user) {
        console.error("User not found in database")
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }
  
      const updatedPoints = Number((user.totalPoints + points).toFixed(4))
  
      const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { totalPoints: updatedPoints },
      })
  
      console.log("Points updated successfully for user_id:", user_id)
  
      return NextResponse.json({ 
        message: "Mining points added successfully",
        sessionEnded: true,
        newBalance: updatedUser.totalPoints
      })
    } catch (error) {
      console.error("API Error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }