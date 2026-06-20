import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const progress = await prisma.problemProgress.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // Format for the frontend store: Record<number, ProblemData>
    const formattedData: Record<number, any> = {};
    for (const p of progress) {
      formattedData[p.problemId] = {
        status: p.status as "Unsolved" | "In Progress" | "Solved",
        favorite: p.favorite,
        notes: p.notes,
        revisionCount: p.revisionCount,
        lastRevised: p.lastRevised ? p.lastRevised.toISOString() : undefined,
        inRevisionQueue: p.inRevisionQueue,
      };
    }

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[PROGRESS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { problemId, data } = body;

    if (!problemId || !data) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Upsert the progress for this problem
    const progress = await prisma.problemProgress.upsert({
      where: {
        userId_problemId: {
          userId: session.user.id,
          problemId: problemId,
        },
      },
      update: {
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

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[PROGRESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
