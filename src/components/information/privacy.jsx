import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center py-4">
      <div className="max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-blue-600 mb-4 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-center mb-8">
          This Privacy Policy describes how{" "}
          <span className="font-semibold text-blue-600">HealCure</span> collects,
          uses, and protects your information when you use our services.
        </p>

        <section className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-blue-600">1. Information We Collect</h2>
            <p>
              We collect personal details such as your name, email address, and
              contact information when you register or make purchases. We also
              collect non-personal data such as device and browser information to
              enhance user experience.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              2. How We Use Your Information
            </h2>
            <p>
              We use your data to provide services like order processing, doctor
              appointment booking, and customer support. We may also send
              updates and promotional offers related to HealCure’s products and
              services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">3. Payment Processing</h2>
            <p>
              All payment transactions are handled securely through{" "}
              <span className="font-semibold">Stripe</span>. We do not store your
              credit card or payment details on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              4. Third-Party Services
            </h2>
            <p>
              HealCure integrates with third-party services such as{" "}
              <span className="font-semibold">Calendly</span> for appointment
              scheduling and <span className="font-semibold">Stripe</span> for
              payment handling. These services operate under their own privacy
              policies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              5. Data Security
            </h2>
            <p>
              We implement strict security protocols to protect your personal
              data from unauthorized access, alteration, or disclosure. However,
              no online platform is entirely risk-free.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              6. Your Rights
            </h2>
            <p>
              You can request to access, modify, or delete your personal
              information at any time by contacting our support team at{" "}
              <a
                href="mailto:support@healcure.ca"
                className="text-blue-600 underline"
              >
                support@healcure.ca
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">
              7. Updates to Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be
              reflected on this page with a revised “Last Updated” date.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-600">8. Contact Us</h2>
            <p>
              For any questions about this Privacy Policy, please contact us at{" "}
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

export default PrivacyPolicy;
