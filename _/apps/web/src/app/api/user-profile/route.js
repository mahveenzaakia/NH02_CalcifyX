import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await sql`
      SELECT * FROM user_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (profiles.length === 0) {
      return Response.json({ profile: null });
    }

    return Response.json({ profile: profiles[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
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
    const { user_type, full_name, phone, date_of_birth, gender, specialization, years_experience, hospital_affiliation } = body;

    if (!user_type || !full_name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO user_profiles (
        user_id, user_type, full_name, phone, date_of_birth, gender, 
        specialization, years_experience, hospital_affiliation
      ) VALUES (
        ${session.user.id}, ${user_type}, ${full_name}, ${phone || null}, 
        ${date_of_birth || null}, ${gender || null}, ${specialization || null}, 
        ${years_experience || null}, ${hospital_affiliation || null}
      ) RETURNING *
    `;

    return Response.json({ profile: result[0] });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, phone, date_of_birth, gender, specialization, years_experience, hospital_affiliation } = body;

    const result = await sql`
      UPDATE user_profiles 
      SET 
        full_name = COALESCE(${full_name}, full_name),
        phone = COALESCE(${phone}, phone),
        date_of_birth = COALESCE(${date_of_birth}, date_of_birth),
        gender = COALESCE(${gender}, gender),
        specialization = COALESCE(${specialization}, specialization),
        years_experience = COALESCE(${years_experience}, years_experience),
        hospital_affiliation = COALESCE(${hospital_affiliation}, hospital_affiliation),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${session.user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json({ profile: result[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}