import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recommendations = await sql`
      SELECT * FROM lifestyle_recommendations 
      WHERE patient_id = ${session.user.id} OR patient_id = 'sample'
      AND is_active = true
      ORDER BY priority ASC, created_at DESC
    `;

    return Response.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recommendation_type, title, description, video_url, video_thumbnail, priority } = body;

    if (!recommendation_type || !title) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO lifestyle_recommendations (
        patient_id, recommendation_type, title, description, 
        video_url, video_thumbnail, priority
      ) VALUES (
        ${session.user.id}, ${recommendation_type}, ${title}, 
        ${description || null}, ${video_url || null}, 
        ${video_thumbnail || null}, ${priority || 1}
      ) RETURNING *
    `;

    return Response.json({ recommendation: result[0] });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}