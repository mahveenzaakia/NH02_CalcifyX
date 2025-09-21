import React, { useState } from "react";
import { generateCalendarDates, generateTimeSlots } from "@/utils/calendar";

export default function BookingModal({
  showCalendar,
  setShowCalendar,
  doctors,
  bookAppointmentMutation,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleBooking = (doctorId) => {
    const appointmentDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    bookAppointmentMutation.mutate(
      {
        doctor_id: doctorId,
        appointment_date: appointmentDateTime.toISOString(),
        notes: "Kidney stone consultation - CalcifyX Enhanced",
      },
      {
        onSuccess: () => {
          setShowCalendar(false);
          setSelectedDate(null);
          setSelectedTime(null);
        },
      }
    );
  };
  
  const resetFlow = () => {
      setShowCalendar(false);
      setSelectedDate(null);
      setSelectedTime(null);
  }

  if (!showCalendar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glassmorphism rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold neon-text">Book Appointment</h3>
          <button
            onClick={resetFlow}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {!selectedDate ? (
          <DateSelector setSelectedDate={setSelectedDate} />
        ) : !selectedTime ? (
          <TimeSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime} />
        ) : (
          <Confirmation
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            doctors={doctors}
            onBook={handleBooking}
          />
        )}
      </div>
    </div>
  );
}

const DateSelector = ({ setSelectedDate }) => (
  <div>
    <h4 className="text-lg font-semibold mb-4">Select Date</h4>
    <div className="calendar-grid mb-6">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-semibold text-gray-400 p-2">
          {day}
        </div>
      ))}
      {generateCalendarDates().slice(0, 28).map((date, index) => (
        <button
          key={index}
          onClick={() => setSelectedDate(date)}
          className="p-3 rounded-lg border border-teal-500/30 hover:bg-teal-500/20 transition-all duration-200 text-center"
        >
          <div className="font-semibold">{date.getDate()}</div>
          <div className="text-xs text-gray-400">
            {date.toLocaleDateString("en", { month: "short" })}
          </div>
        </button>
      ))}
    </div>
  </div>
);

const TimeSelector = ({ selectedDate, setSelectedDate, setSelectedTime }) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">
                Select Time for {selectedDate.toLocaleDateString()}
            </h4>
            <button
                onClick={() => setSelectedDate(null)}
                className="text-teal-400 hover:text-teal-300"
            >
                ← Back to dates
            </button>
        </div>
        <div className="time-grid">
            {generateTimeSlots().map((time) => (
                <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className="p-3 rounded-lg border border-teal-500/30 hover:bg-teal-500/20 transition-all duration-200"
                >
                    {time}
                </button>
            ))}
        </div>
    </div>
);

const Confirmation = ({ selectedDate, selectedTime, setSelectedTime, doctors, onBook }) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Confirm Appointment</h4>
            <button
                onClick={() => setSelectedTime(null)}
                className="text-teal-400 hover:text-teal-300"
            >
                ← Back to times
            </button>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <h5 className="font-semibold mb-2">Appointment Details</h5>
            <p>Date: {selectedDate.toLocaleDateString()}</p>
            <p>Time: {selectedTime}</p>
            <p>Type: Kidney Stone Consultation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {doctors.slice(0, 3).map((doctor) => (
                <div
                    key={doctor.user_id}
                    className="p-4 rounded-lg border border-teal-500/30 hover:bg-teal-500/10 cursor-pointer transition-all duration-200"
                    onClick={() => onBook(doctor.user_id)}
                >
                    <h6 className="font-semibold">{doctor.full_name}</h6>
                    <p className="text-sm text-gray-400">{doctor.specialization}</p>
                    <p className="text-sm text-yellow-400">★ {doctor.rating}</p>
                </div>
            ))}
        </div>
    </div>
);
