import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const doctors = await sql`
      SELECT 
        user_id,
        full_name,
        specialization,
        years_experience,
        rating,
        total_reviews,
        hospital_affiliation
      FROM user_profiles 
      WHERE user_type = 'doctor'
      ORDER BY rating DESC, total_reviews DESC
    `;

    return Response.json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}