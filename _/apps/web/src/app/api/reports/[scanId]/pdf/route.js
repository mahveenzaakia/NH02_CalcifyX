import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { scanId } = params;
    const searchParams = new URL(request.url).searchParams;
    const reportType = searchParams.get('type') || 'patient';

    // Fetch scan and report data
    const [scanData] = await sql`
      SELECT 
        ms.*,
        sd.stone_count,
        sd.max_stone_size,
        sd.risk_level,
        sd.requires_appointment,
        sd.confidence_score,
        sd.stones_data,
        mr.report_content,
        up.full_name,
        up.date_of_birth
      FROM medical_scans ms
      LEFT JOIN stone_detections sd ON ms.id = sd.scan_id
      LEFT JOIN medical_reports mr ON ms.id = mr.scan_id AND mr.report_type = ${reportType}
      LEFT JOIN user_profiles up ON ms.patient_id = up.user_id
      WHERE ms.id = ${scanId} AND ms.patient_id = ${session.user.id}
    `;

    if (!scanData) {
      return Response.json({ error: "Scan not found" }, { status: 404 });
    }

    // Generate PDF content (HTML that will be converted to PDF on frontend)
    const pdfContent = generatePDFHTML(scanData, reportType);

    return Response.json({ 
      pdfContent,
      filename: `CalcifyX_${reportType}_report_${scanId}_${new Date().toISOString().split('T')[0]}.pdf`,
      scanData: {
        id: scanData.id,
        scan_type: scanData.scan_type,
        upload_date: scanData.upload_date,
        stone_count: scanData.stone_count,
        max_stone_size: scanData.max_stone_size,
        risk_level: scanData.risk_level,
        confidence_score: scanData.confidence_score
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generatePDFHTML(scanData, reportType) {
  const reportContent = scanData.report_content || {};
  const currentDate = new Date().toLocaleDateString();
  
  const baseHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CalcifyX Medical Report</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background: white;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #14B8A6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #14B8A6, #0D9488);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-size: 24px;
          font-weight: bold;
          color: #14B8A6;
        }
        .report-info {
          text-align: right;
          color: #666;
        }
        .patient-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #14B8A6;
          border-bottom: 2px solid #14B8A6;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .findings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .finding-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #14B8A6;
        }
        .finding-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .finding-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
          margin-top: 5px;
        }
        .risk-level {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .risk-high { background: #fef2f2; color: #dc2626; }
        .risk-medium { background: #fef3c7; color: #d97706; }
        .risk-low { background: #f0fdf4; color: #16a34a; }
        .recommendations {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
        }
        .recommendations ul {
          margin: 0;
          padding-left: 20px;
        }
        .recommendations li {
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .stones-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .stones-table th,
        .stones-table td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
        }
        .stones-table th {
          background: #f8f9fa;
          font-weight: bold;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <div class="logo-icon">⚕</div>
          <div class="logo-text">CalcifyX</div>
        </div>
        <div class="report-info">
          <div><strong>${reportType === 'patient' ? 'Patient Report' : 'Clinical Report'}</strong></div>
          <div>Generated: ${currentDate}</div>
          <div>Report ID: ${scanData.id}</div>
        </div>
      </div>

      <div class="patient-info">
        <h3 style="margin-top: 0;">Patient Information</h3>
        <p><strong>Name:</strong> ${scanData.full_name || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${scanData.date_of_birth ? new Date(scanData.date_of_birth).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Scan Date:</strong> ${new Date(scanData.upload_date).toLocaleDateString()}</p>
        <p><strong>Scan Type:</strong> ${scanData.scan_type}</p>
      </div>

      <div class="section">
        <h2 class="section-title">Analysis Summary</h2>
        ${reportContent.summary || `Analysis completed. ${scanData.stone_count || 0} kidney stone(s) detected.`}
      </div>

      <div class="section">
        <h2 class="section-title">Key Findings</h2>
        <div class="findings-grid">
          <div class="finding-card">
            <div class="finding-label">Stones Detected</div>
            <div class="finding-value">${scanData.stone_count || 0}</div>
          </div>
          <div class="finding-card">
            <div class="finding-label">Largest Stone</div>
            <div class="finding-value">${scanData.max_stone_size || 'N/A'} cm</div>
          </div>
          <div class="finding-card">
            <div class="finding-label">Risk Level</div>
            <div class="finding-value">
              <span class="risk-level risk-${scanData.risk_level || 'low'}">${scanData.risk_level || 'Low'}</span>
            </div>
          </div>
          <div class="finding-card">
            <div class="finding-label">Confidence Score</div>
            <div class="finding-value">${((scanData.confidence_score || 0.85) * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      ${scanData.stones_data ? generateStonesTable(JSON.parse(scanData.stones_data), reportType) : ''}

      <div class="section">
        <h2 class="section-title">Recommendations</h2>
        <div class="recommendations">
          ${generateRecommendations(reportContent, scanData, reportType)}
        </div>
      </div>

      ${reportType === 'doctor' ? generateTechnicalSection(scanData, reportContent) : ''}

      <div class="footer">
        <p><strong>CalcifyX - Smarter Kidney Care with AI</strong></p>
        <p>This report was generated using advanced AI analysis. Please consult with a healthcare professional for medical advice.</p>
        <p>© ${new Date().getFullYear()} CalcifyX. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return baseHTML;
}

function generateStonesTable(stones, reportType) {
  if (!stones || stones.length === 0) return '';

  const tableHeaders = reportType === 'doctor' 
    ? ['Stone ID', 'Size (cm)', 'Location', 'Composition', 'Probability', 'Coordinates']
    : ['Stone ID', 'Size (cm)', 'Location', 'Probability'];

  let tableHTML = `
    <div class="section">
      <h2 class="section-title">Detected Stones</h2>
      <table class="stones-table">
        <thead>
          <tr>${tableHeaders.map(header => `<th>${header}</th>`).join('')}</tr>
        </thead>
        <tbody>
  `;

  stones.forEach(stone => {
    const row = reportType === 'doctor' 
      ? `<tr>
          <td>Stone ${stone.id}</td>
          <td>${stone.size}</td>
          <td>${stone.location}</td>
          <td>${stone.composition || 'N/A'}</td>
          <td>${(stone.probability * 100).toFixed(1)}%</td>
          <td>${stone.coordinates ? `(${stone.coordinates.x}, ${stone.coordinates.y}, ${stone.coordinates.z})` : 'N/A'}</td>
        </tr>`
      : `<tr>
          <td>Stone ${stone.id}</td>
          <td>${stone.size}</td>
          <td>${stone.location}</td>
          <td>${(stone.probability * 100).toFixed(1)}%</td>
        </tr>`;
    tableHTML += row;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  return tableHTML;
}

function generateRecommendations(reportContent, scanData, reportType) {
  const recommendations = reportContent.findings?.recommendations || 
    reportContent.recommendations || [
      "Follow up with healthcare provider",
      "Maintain adequate hydration",
      "Consider dietary modifications"
    ];

  return `
    <ul>
      ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
    ${scanData.requires_appointment ? 
      '<p style="background: #fef2f2; padding: 10px; border-radius: 5px; color: #dc2626; font-weight: bold;">⚠️ Appointment with a specialist is recommended.</p>' : 
      ''
    }
  `;
}

function generateTechnicalSection(scanData, reportContent) {
  return `
    <div class="section">
      <h2 class="section-title">Technical Analysis</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
        <p><strong>AI Model:</strong> CalcifyX AI v2.1</p>
        <p><strong>Analysis Time:</strong> ${new Date(scanData.upload_date).toLocaleString()}</p>
        <p><strong>Scan Quality:</strong> ${reportContent.clinical_findings?.scan_quality || 'Good'}</p>
        <p><strong>Confidence Score:</strong> ${((scanData.confidence_score || 0.85) * 100).toFixed(1)}%</p>
        ${reportContent.technical_notes ? `<p><strong>Technical Notes:</strong> ${reportContent.technical_notes}</p>` : ''}
      </div>
    </div>
  `;
}