import React from 'react';
import { ShieldCheck } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with brand & back link (optional) */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
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
            Terms of Service
          </h2>
          <p className="text-gray-500 mt-2">Last updated: April 25, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-indigo prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            Welcome to RozgarDo (“Company”, “we”, “our”, “us”). These Terms of Service (“Terms”) govern your use of our website, mobile application, and related services (collectively, the “Service”) provided by RozgarDo Technologies.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part, you may not access the Service. RozgarDo is a platform that connects blue‑collar workers (“Job Seekers”) with employers (“Employers”) in India.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Eligibility</h3>
          <p>
            You must be at least 18 years old to use our Service. By using RozgarDo, you represent that you are legally capable of entering into binding contracts under Indian law (Indian Contract Act, 1872).
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. User Accounts</h3>
          <p>
            You are responsible for safeguarding your account credentials and for any activities under your account. You agree to provide accurate, current, and complete information during registration. We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Job Postings & Applications</h3>
          <p>
            Employers may post genuine job opportunities. Job Seekers may apply directly. RozgarDo does not guarantee any employment offer or placement. We do not charge any fees to Job Seekers for using the platform – any request for payment from a worker is fraudulent and should be reported immediately.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Prohibited Conduct</h3>
          <p>
            You agree not to: (a) post fake, misleading, or illegal job listings; (b) harass, abuse, or discriminate against any user; (c) attempt to bypass our verification systems; (d) use the Service for any unlawful purpose under Indian law.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Intellectual Property</h3>
          <p>
            All content, logos, and trademarks on RozgarDo are our property or licensed to us. You may not copy, modify, or distribute any part of the Service without prior written consent.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, RozgarDo Technologies shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including any disputes between Employers and Job Seekers.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9. Changes to Terms</h3>
          <p>
            We may update these Terms from time to time. Continued use of the Service after changes constitute acceptance of the revised Terms.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10. Contact Us</h3>
          <p>
            If you have questions about these Terms, please contact us at:{' '}
            <a href="mailto:support@rozgardo.com" className="text-indigo-600 hover:underline">
              support@rozgardo.com
            </a>
          </p>

          <div className="bg-indigo-50 p-4 rounded-lg mt-8 text-sm text-gray-700 border border-indigo-100">
            <strong>⚠️ Important:</strong> RozgarDo never demands money from job seekers. If anyone asks for payment, report them immediately via the app or email <strong>support@rozgardo.com</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;