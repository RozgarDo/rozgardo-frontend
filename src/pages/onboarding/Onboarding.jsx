import React from 'react';
import { Zap } from 'lucide-react';

const Onboarding = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 40%, rgba(99,102,241,0.12), transparent 60%), linear-gradient(135deg, #ffffff, #eef2ff, #e0e7ff)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Background Blobs */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-5%',
        width: 400,
        height: 400,
        background: 'rgba(199, 210, 254, 0.4)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-5%',
        width: 400,
        height: 400,
        background: 'rgba(224, 231, 255, 0.5)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Subtle Grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em'
          }}>
            RozgarDo
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 130px)',
        padding: '24px',
        animation: 'fadeInUp 0.3s ease-out'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 16,
            letterSpacing: '-0.02em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span>🚀</span>
            <span>Launching Soon</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#475569',
            marginBottom: 12,
            fontWeight: 500
          }}>
            We're building something amazing for India's workforce.
          </p>

          {/* Supporting Text */}
          <p style={{
            fontSize: 16,
            color: '#64748b',
            maxWidth: 480,
            margin: '0 auto 64px',
            lineHeight: 1.6
          }}>
            RozgarDo connects drivers, helpers, delivery partners, cooks, and cleaners with real job opportunities across India.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 64 }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 24px', border: '1px solid rgba(99,102,241,0.1)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Verified Jobs</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 24px', border: '1px solid rgba(99,102,241,0.1)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Zero Fees</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 24px', border: '1px solid rgba(99,102,241,0.1)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Quick Hire</p>
            </div>
          </div>

          {/* Contact Info */}
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 64 }}>
            For queries, contact us at{' '}
            <a
              href="mailto:support@rozgardo.com"
              style={{
                color: '#6366f1',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                fontWeight: 500
              }}
            >
              support@rozgardo.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '12px 16px',
        textAlign: 'center',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>
          © 2026 RozgarDo
        </p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
