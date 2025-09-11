import React from 'react';
import { Check, Package, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import apointment from '../../assets/images/appointment.png'
const AppointmentSuccess = () => {
  return (
    <div className="mt-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto lg:w-100 h-60 flex items-center justify-center mb-4">
            <img src={apointment} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked Successfully!</h1>
        </div>


        <div className="space-y-3">
          <Link to="/">
            <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium">
              Go Back
            </button>
          </Link>
        </div>

       
      </div>
    </div>
  );
};

export default AppointmentSuccess;
