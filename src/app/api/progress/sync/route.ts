import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { localData } = body;

    if (!localData || typeof localData !== 'object') {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    // We process the local data and upsert it into the database
    // localData is an object mapping problemId (string or number) to ProblemData
    
    // Prisma transactions for efficiency
    const upserts = Object.entries(localData).map(([idStr, data]: [string, any]) => {
      const problemId = parseInt(idStr, 10);
      return prisma.problemProgress.upsert({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId: problemId,
          },
        },
        update: {
          // If the cloud already has it solved, we might not want to override it with 'Unsolved'
          // But for simplicity, we let the client state win during a sync push
          status: data.status,
          favorite: data.favorite,
          notes: data.notes,
          revisionCount: data.revisionCount,
          lastRevised: data.lastRevised ? new Date(data.lastRevised) : null,
          inRevisionQueue: data.inRevisionQueue,
        },
        create: {
          userId: session.user.id,
          problemId: problemId,
          status: data.status || "Unsolved",
          favorite: data.favorite || false,
          notes: data.notes || "",
          revisionCount: data.revisionCount || 0,
          lastRevised: data.lastRevised ? new Date(data.lastRevised) : null,
          inRevisionQueue: data.inRevisionQueue || false,
        },
      });
    });

    await prisma.$transaction(upserts);

    return NextResponse.json({ success: true, message: "Synced successfully" });
  } catch (error) {
    console.error("[SYNC_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
