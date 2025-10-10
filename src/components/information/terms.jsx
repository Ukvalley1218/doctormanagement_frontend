import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center py-4">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-4 text-center">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to <span className="font-semibold text-blue-600">HealCure</span>.  
          Please read these Terms carefully before using our services.
        </p>

        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-blue-600">1. Overview</h2>
            <p>
              HealCure is an online platform that provides e-commerce services
              for purchasing medicines and booking doctor appointments through
              Calendly. By using our website or mobile app, you agree to comply
              with these Terms & Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              2. Use of Our Services
            </h2>
            <p>
              You agree to use HealCure only for lawful purposes. You must not
              misuse our services, including attempting unauthorized access to
              any part of the platform or using it for fraudulent activities.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              3. E-commerce Purchases
            </h2>
            <p>
              Our platform allows you to buy medicines through secure payment
              processing provided by Stripe. Prices, availability, and delivery
              times are subject to change based on product availability and
              location.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              4. Doctor Appointments
            </h2>
            <p>
              HealCure allows users to book doctor consultations through
              Calendly. We act as a scheduling facilitator and are not
              responsible for the advice, diagnosis, or treatment provided by
              the healthcare professional.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              5. Payment & Refund Policy
            </h2>
            <p>
              Payments for medicines are processed securely through Stripe. All
              sales are final unless otherwise stated. Refunds are only issued
              for defective or undelivered products after review by our support
              team.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              6. Limitation of Liability
            </h2>
            <p>
              HealCure will not be held responsible for any damages or losses
              resulting from misuse of the platform or third-party services such
              as Calendly or Stripe.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              7. Updates to Terms
            </h2>
            <p>
              HealCure reserves the right to modify or update these Terms at any
              time. Continued use of the platform implies acceptance of any
              changes made.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">8. Contact Us</h2>
            <p>
              If you have any questions regarding these Terms & Conditions,
              please contact us at{" "}
              <a
                href="mailto:support@healcure.ca"
                className="text-blue-600 underline"
              >
                support@healcure.ca
              </a>
              .
            </p>
          </div>
        </section>

        <p className="text-center text-gray-500 mt-10 text-sm">
          © {new Date().getFullYear()} HealCure. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
