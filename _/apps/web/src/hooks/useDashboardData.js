import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export function useDashboardData(showCalendar) {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const { data: profileData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await fetch("/api/user-profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: scansData, isLoading: scansLoading } = useQuery({
    queryKey: ["scans"],
    queryFn: async () => {
      const response = await fetch("/api/scans");
      if (!response.ok) throw new Error("Failed to fetch scans");
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 5000,
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json();
    },
    enabled: !!user && showCalendar,
  });

  const uploadScanMutation = useMutation({
    mutationFn: async (scanData) => {
      const response = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scanData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload scan");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
  
  const bookAppointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) throw new Error("Failed to book appointment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      alert("Appointment booked successfully!");
    },
  });

  const downloadPDF = async (scanId, reportType = "patient") => {
    try {
      const response = await fetch(
        `/api/reports/${scanId}/pdf?type=${reportType}`,
      );
      if (!response.ok) throw new Error("Failed to generate PDF");

      const data = await response.json();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(data.pdfContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF report");
    }
  };

  return {
    profile: profileData?.profile,
    scans: scansData?.scans || [],
    scansLoading,
    appointments: appointmentsData?.appointments || [],
    doctors: doctorsData?.doctors || [],
    uploadScanMutation,
    bookAppointmentMutation,
    downloadPDF,
  };
}
