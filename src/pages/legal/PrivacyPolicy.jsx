import React from 'react';
import { Lock, Eye, Database, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with brand & back link */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">RozgarDo</h1>
          </div>
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
          >
            ← Back
          </a>
        </div>

        {/* Document title */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h2>
          <p className="text-gray-500 mt-2">Effective: April 25, 2026</p>
        </div>

        {/* Content with icons for visual touch */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-semibold text-gray-900">1. Information We Collect</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We collect information you provide directly, such as when you create an account, fill your profile (name, phone number, Aadhaar‑verified identity, skills, work experience), or post a job (company details, location, pay range). We also automatically collect usage data, device information, and location (with your consent) to improve matching and safety.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h3>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
              <li>Connect Job Seekers with relevant Employers in your area.</li>
              <li>Verify identities to reduce fraud and build trust.</li>
              <li>Send you job alerts, application updates, and important platform notifications.</li>
              <li>Improve our algorithms, customer support, and safety features.</li>
              <li>Comply with legal obligations under Indian data protection laws (DPDP Act, 2023).</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-indigo-500" />
              <h3 className="text-xl font-semibold text-gray-900">3. Sharing of Information</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We do <strong>not</strong> sell your personal data. We may share information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 ml-2 mt-1">
              <li><strong>Employers:</strong> Only when you apply for a job, they see your profile as necessary for hiring.</li>
              <li><strong>Service providers:</strong> Cloud hosting, analytics, SMS/email delivery – all bound by confidentiality.</li>
              <li><strong>Legal authorities:</strong> If required by law or to protect our rights and user safety.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-indigo-500" /> 4. Your Rights & Choices
            </h3>
            <p className="text-gray-700 leading-relaxed">
              You can access, update, or delete your account information anytime from your profile settings. You may request a copy of your data or ask us to stop processing it by contacting <strong>support@rozgardo.com</strong>. Indian residents have additional rights under the Digital Personal Data Protection Act, 2023.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention & Security</h3>
            <p className="text-gray-700 leading-relaxed">
              We retain your data as long as your account is active or as needed to provide services. We implement industry-standard encryption, access controls, and regular security audits. However, no online transmission is 100% secure – you use RozgarDo at your own risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Children’s Privacy</h3>
            <p className="text-gray-700 leading-relaxed">
              Our Service is not intended for individuals under 18. We do not knowingly collect data from minors. If we become aware, we will delete such information immediately.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Changes to This Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy occasionally. Material changes will be notified via email or a prominent notice on our platform. Your continued use after changes means acceptance.
            </p>
          </section>

          <section className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
            <h3 className="font-bold text-gray-900 mb-2">📞 Contact Us</h3>
            <p className="text-gray-700">
              For privacy questions or to exercise your rights:<br />
              Email: <a href="mailto:support@rozgardo.com" className="text-indigo-600 hover:underline">support@rozgardo.com</a><br />
              Address: RozgarDo Technologies, 4th Floor, Koramangala, Bengaluru – 560034, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;