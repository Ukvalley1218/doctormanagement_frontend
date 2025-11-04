import React, { useState } from "react";
import { Calendar, Clock, User, Phone, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Appointment = () => {
  const [activeTab, setActiveTab] = useState("recent");

  // Sample data for appointments
  // const recentAppointments = [
  //   {
  //     id: 1,
  //     doctor: "Dr. Michael Smith",
  //     specialty: "Cardiology Consultation",
  //     date: "Jan 15, 2024",
  //     time: "8:30 AM",
  //     status: "Confirm",
  //     avatar: "MS",
  //   },
  //   {
  //     id: 2,
  //     doctor: "Dr. Sarah Johnson",
  //     specialty: "General Checkup",
  //     date: "Jan 16, 2024",
  //     time: "10:15 AM",
  //     status: "Pending",
  //     avatar: "SJ",
  //   },
  //   {
  //     id: 3,
  //     doctor: "Dr. Robert Davis",
  //     specialty: "Orthopedic Consultation",
  //     date: "Jan 17, 2024",
  //     time: "11:00 AM",
  //     status: "Confirm",
  //     avatar: "RD",
  //   },
  //   {
  //     id: 4,
  //     doctor: "Dr. Emily Wilson",
  //     specialty: "Dermatology Consultation",
  //     date: "Jan 18, 2024",
  //     time: "2:15 PM",
  //     status: "Confirm",
  //     avatar: "EW",
  //   },
  // ];

  // const completedAppointments = [
  //   {
  //     id: 5,
  //     doctor: "Dr. James Brown",
  //     specialty: "Neurology Consultation",
  //     date: "Jan 10, 2024",
  //     time: "9:00 AM",
  //     status: "Complete",
  //     avatar: "JB",
  //   },
  //   {
  //     id: 6,
  //     doctor: "Dr. Lisa Anderson",
  //     specialty: "Pediatric Checkup",
  //     date: "Jan 12, 2024",
  //     time: "1:30 PM",
  //     status: "Complete",
  //     avatar: "LA",
  //   },
  //   {
  //     id: 7,
  //     doctor: "Dr. Carlos Martinez",
  //     specialty: "Gastroenterology Consultation",
  //     date: "Jan 13, 2024",
  //     time: "3:30 PM",
  //     status: "Complete",
  //     avatar: "CM",
  //   },
  //   {
  //     id: 8,
  //     doctor: "Dr. Mark Taylor",
  //     specialty: "Ophthalmology Consultation",
  //     date: "Jan 14, 2024",
  //     time: "11:00 AM",
  //     status: "Complete",
  //     avatar: "MT",
  //   },
  // ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirm":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "complete":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }) => (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
          {appointment.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-left truncate">
                {appointment.doctor}
              </h3>
              <p className="text-sm text-gray-600 text-left mt-1">
                {appointment.specialty}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex text-left items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex text-left items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>
          {showActions && (
            <div className="flex items-center space-x-4 mt-3 text-sm">
              <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>View Report</span>
              </button>
              <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-0 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-left text-gray-900">
                Appointments Dashboard
              </h1>
              <p className="text-gray-600 text-left mt-1">
                Manage your current and completed appointments
              </p>
            </div>
            <Link to="/book_appointment">
              <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer space-x-2 transition-colors">
                <User className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <div
            className={`${
              activeTab === "recent" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Appointments
                </h2>
                <span className="text-sm text-gray-500">
                  {recentAppointments.length} Scheduled
                </span>
              </div>
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions={false}
                  />
                ))}
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border-t border-gray-100">
                View All Appointments
              </button>
            </div>
          </div>

          {/* Completed Appointments */}
          <div
            className={`${
              activeTab === "completed" ? "block" : "hidden"
            } lg:block`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Completed Appointments
                </h2>
                <span className="text-sm text-gray-500">
                  {completedAppointments.length} Completed
                </span>
              </div>
              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
              <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border-t border-gray-100">
                View All Completed
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View - Single Column */}
        <div className="lg:hidden">
          {activeTab === "recent" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Appointments
              </h2>
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions={false}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Completed Appointments
              </h2>
              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
