import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Briefcase, Search, X, ArrowLeft, Calendar, Hash, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to shuffle an array (Fisher–Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const AllJobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  // Applied jobs state
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingMap, setApplyingMap] = useState({});

  // Employer photo cache: { employerId: photoUrl }
  const [employerPhotoMap, setEmployerPhotoMap] = useState({});
  const [fetchingPhotos, setFetchingPhotos] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user]);

  // Fetch employer photos when jobs change
  useEffect(() => {
    if (jobs.length === 0) return;

    const uniqueEmployerIds = [...new Set(jobs.map(job => job.employer_id).filter(Boolean))];
    const missingIds = uniqueEmployerIds.filter(id => !employerPhotoMap[id]);

    if (missingIds.length === 0) return;

    const fetchPhotos = async () => {
      setFetchingPhotos(true);
      try {
        const promises = missingIds.map(async (id) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/profile/${id}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { id, photoUrl: data.user?.photo_url || null };
          } catch (err) {
            console.warn(`Could not fetch photo for employer ${id}:`, err);
            return { id, photoUrl: null };
          }
        });

        const results = await Promise.all(promises);
        const newMap = { ...employerPhotoMap };
        results.forEach(({ id, photoUrl }) => {
          if (photoUrl) newMap[id] = photoUrl;
        });
        setEmployerPhotoMap(newMap);
      } catch (err) {
        console.error('Error fetching employer photos:', err);
      } finally {
        setFetchingPhotos(false);
      }
    };

    fetchPhotos();
  }, [jobs]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?status=approved`);
      if (res.ok) {
        const data = await res.json();
        // Shuffle the jobs so they appear in random order
        const shuffled = shuffleArray(data);
        setJobs(shuffled);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/employee/${user.id}`);
      if (res.ok) {
        const apps = await res.json();
        const appliedIds = new Set(apps.map(app => app.job_id));
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      console.warn('Could not fetch applications', err);
    }
  };

  const handleApply = async (jobId, e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to apply for jobs.');
      return;
    }
    if (appliedJobIds.has(jobId)) return;

    setApplyingMap(prev => ({ ...prev, [jobId]: true }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, employee_id: user.id }),
      });

      if (res.ok) {
        setAppliedJobIds(prev => new Set(prev).add(jobId));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply Error:', err);
      alert('Error: ' + (err.message || 'Could not submit application.'));
    } finally {
      setApplyingMap(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const locations = useMemo(() => [...new Set(jobs.map(j => j.location).filter(Boolean))].sort(), [jobs]);
  const categories = useMemo(() => [...new Set(jobs.map(j => j.category).filter(Boolean))].sort(), [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        job.title?.toLowerCase().includes(query) ||
        job.employer_name?.toLowerCase().includes(query) ||
        (job.jobs_serial_number && job.jobs_serial_number.toLowerCase().includes(query));
      const matchesLocation = !locationFilter || job.location === locationFilter;
      const matchesCategory = !categoryFilter || job.category === categoryFilter;
      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [jobs, searchQuery, locationFilter, categoryFilter]);

  const hasActiveFilters = searchQuery || locationFilter || categoryFilter;
  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setCategoryFilter('');
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    const today = new Date().toISOString().split('T')[0];
    return deadline < today;
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>All Jobs</h1>
        <p style={{ color: '#64748B', fontSize: '1.05rem' }}>Explore opportunities near you</p>
      </div>

      {/* Search + Filters Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', padding: '1.25rem', background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by title, company, or Job ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #E2E8F0', borderRadius: '0.5rem',
              fontSize: '0.9rem', outline: 'none', background: '#F8FAFC',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} style={{ padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#F8FAFC', color: locationFilter ? '#0F172A' : '#94A3B8', cursor: 'pointer', fontFamily: 'inherit', minWidth: '140px' }}>
          <option value="">All Locations</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '0.75rem 1rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontSize: '0.875rem', background: '#F8FAFC', color: categoryFilter ? '#0F172A' : '#94A3B8', cursor: 'pointer', fontFamily: 'inherit', minWidth: '140px' }}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {hasActiveFilters && (
          <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 1rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
        Showing {filteredJobs.length} of {jobs.length} jobs {hasActiveFilters && <span>(filtered)</span>}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B', fontSize: '1.1rem' }}>Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No jobs found</h3>
          <p>Try adjusting your search or filters.</p>
          {hasActiveFilters && <button onClick={clearFilters} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Clear all filters</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredJobs.map((job) => {
            const initial = job.employer_name ? job.employer_name.charAt(0).toUpperCase() : 'C';
            const deadline = job.apply_deadline ? new Date(job.apply_deadline).toLocaleDateString() : null;
            const isDeadlineSoon = deadline && new Date(job.apply_deadline) < new Date(Date.now() + 7 * 86400000);
            const expired = isDeadlinePassed(job.apply_deadline);
            const isApplied = appliedJobIds.has(job.id);
            const isApplying = applyingMap[job.id] || false;
            const employerPhoto = employerPhotoMap[job.employer_id];

            return (
              <div
                key={job.id}
                style={{
                  background: 'white', borderRadius: '1rem', padding: '1.5rem',
                  border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#4F46E5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                {/* ----- TOP SECTION: Logo + Title + Employer ----- */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0,
                    border: '1px solid rgba(79,70,229,0.1)',
                    background: employerPhoto ? 'transparent' : 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {employerPhoto ? (
                      <img src={employerPhoto} alt={job.employer_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#4F46E5', fontWeight: 800, fontSize: '1.1rem' }}>{initial}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.35,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      marginBottom: '0.2rem'
                    }}>
                      {job.title}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.employer_name}
                    </p>
                  </div>
                </div>

                {/* ----- NEW ROW: Category + Job ID ----- */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    background: '#F8FAFC',
                    color: '#475569',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #E2E8F0',
                    maxWidth: '70%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {job.category}
                  </span>
                  {job.jobs_serial_number && (
                    <span style={{
                      background: '#F3F4F6',
                      color: '#4B5563',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #E5E7EB',
                      fontFamily: 'monospace',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap'
                    }}>
                      {job.jobs_serial_number}
                    </span>
                  )}
                </div>

                {/* ----- FIXED ROW: Location + Deadline + Salary (always single line) ----- */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderTop: '1px solid #F1F5F9',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '0.75rem',
                  flexWrap: 'nowrap',    // prevent wrapping
                  gap: '0.25rem 0.5rem',
                  overflow: 'hidden'     // hide any overflow gracefully
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#475569',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: '1 1 auto'
                  }}>
                    <MapPin size={15} color="#94A3B8" /> {job.location}
                  </span>
                  {deadline ? (
                    <span style={{
                      background: expired ? '#FEE2E2' : (isDeadlineSoon ? '#FEF3C7' : '#F3F4F6'),
                      color: expired ? '#DC2626' : (isDeadlineSoon ? '#D97706' : '#6B7280'),
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.375rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      <Calendar size={12} /> {expired ? 'Closed' : `Apply by ${deadline}`}
                    </span>
                  ) : (
                    expired && (
                      <span style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.3rem 0.65rem',
                        borderRadius: '0.375rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        <AlertCircle size={12} /> Closed
                      </span>
                    )
                  )}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.15rem',
                    fontWeight: 800,
                    color: '#059669',
                    fontSize: '0.95rem',
                    background: '#ECFDF5',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.375rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    <IndianRupee size={15} /> {job.salary}
                  </span>
                </div>

                {/* ----- ACTION BUTTONS ----- */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '0.6rem',
                      background: 'white', color: '#334155',
                      border: '1px solid #E2E8F0', borderRadius: '0.5rem',
                      fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      View Details
                    </button>
                  </Link>

                  {expired ? (
                    <button disabled style={{
                      width: '100%', padding: '0.6rem',
                      background: '#E5E7EB', color: '#9CA3AF',
                      border: 'none', borderRadius: '0.5rem',
                      fontSize: '0.8rem', fontWeight: 700,
                      cursor: 'not-allowed', fontFamily: 'inherit',
                    }}>
                      Closed
                    </button>
                  ) : isApplied ? (
                    <button disabled style={{
                      width: '100%', padding: '0.6rem',
                      background: '#D1FAE5', color: '#065F46',
                      border: 'none', borderRadius: '0.5rem',
                      fontSize: '0.8rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                      cursor: 'default', fontFamily: 'inherit',
                    }}>
                      <CheckCircle size={16} /> Applied
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleApply(job.id, e)}
                      disabled={isApplying}
                      style={{
                        width: '100%', padding: '0.6rem',
                        background: isApplying ? '#A5B4FC' : 'linear-gradient(to right, #4F46E5, #6366F1)',
                        color: 'white',
                        border: 'none', borderRadius: '0.5rem',
                        fontSize: '0.8rem', fontWeight: 700,
                        cursor: isApplying ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {isApplying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllJobs;