import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointments = await sql`
      SELECT 
        a.*,
        dp.full_name as doctor_name,
        dp.specialization,
        dp.hospital_affiliation,
        pp.full_name as patient_name
      FROM appointments a
      JOIN user_profiles dp ON a.doctor_id = dp.user_id
      JOIN user_profiles pp ON a.patient_id = pp.user_id
      WHERE a.patient_id = ${session.user.id} OR a.doctor_id = ${session.user.id}
      ORDER BY a.appointment_date DESC
    `;

    return Response.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
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
    const { doctor_id, scan_id, appointment_date, notes } = body;

    if (!doctor_id || !appointment_date) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO appointments (patient_id, doctor_id, scan_id, appointment_date, notes)
      VALUES (${session.user.id}, ${doctor_id}, ${scan_id || null}, ${appointment_date}, ${notes || null})
      RETURNING *
    `;

    return Response.json({ appointment: result[0] });
  } catch (error) {
    console.error("Error creating appointment:", error);
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
    const { appointment_id, status, notes } = body;

    if (!appointment_id) {
      return Response.json({ error: "Missing appointment ID" }, { status: 400 });
    }

    const result = await sql`
      UPDATE appointments 
      SET 
        status = COALESCE(${status}, status),
        notes = COALESCE(${notes}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${appointment_id} 
      AND (patient_id = ${session.user.id} OR doctor_id = ${session.user.id})
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Appointment not found" }, { status: 404 });
    }

    return Response.json({ appointment: result[0] });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}