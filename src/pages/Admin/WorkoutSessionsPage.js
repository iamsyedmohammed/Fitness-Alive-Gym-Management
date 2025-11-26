import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import API_BASE_URL from '../../config/api';
import './AdminPages.css';

const WorkoutSessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_id: '',
    trainer_id: '',
    session_date: '',
    session_time: '',
    duration: 60,
    notes: '',
  });

  useEffect(() => {
    fetchSessions();
    fetchMembers();
    fetchTrainers();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getWorkoutSessions.php`);
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getMembers.php`);
      const data = await response.json();
      if (data.success) {
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getTrainers.php`);
      const data = await response.json();
      if (data.success) {
        setTrainers(data.trainers || []);
      }
    } catch (err) {
      console.error('Error fetching trainers:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/scheduleSession.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormData({
          member_id: '',
          trainer_id: '',
          session_date: '',
          session_time: '',
          duration: 60,
          notes: '',
        });
        fetchSessions();
      } else {
        alert(data.error || 'Scheduling failed');
      }
    } catch (err) {
      alert('Error scheduling session');
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scheduleSession.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchSessions();
      }
    } catch (err) {
      alert('Error updating session');
    }
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId);
    return trainer ? trainer.name : 'Unknown';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminHeader />
      <div className="admin-content">
        <div className="content-header">
          <h1>Workout Sessions</h1>
        </div>

        <div className="table-actions" style={{ marginBottom: '20px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            📅 Schedule Session
          </button>
        </div>

        <div className="data-table">
          <div className="table-header">
            <h2>All Sessions</h2>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Trainer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        No sessions scheduled
                      </td>
                    </tr>
                  ) : (
                    sessions.map((session) => (
                      <tr key={session.id}>
                        <td>{getMemberName(session.member_id)}</td>
                        <td>{getTrainerName(session.trainer_id)}</td>
                        <td>{session.session_date || '-'}</td>
                        <td>{session.session_time || '-'}</td>
                        <td>{session.duration} min</td>
                        <td>
                          <span className={`status-badge status-${session.status}`}>
                            {session.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {session.status === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(session.id, 'completed')}
                                  className="btn-small btn-view"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleStatusChange(session.id, 'cancelled')}
                                  className="btn-small btn-delete"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Schedule Workout Session</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              <form onSubmit={handleSave} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Member *</label>
                    <select
                      name="member_id"
                      value={formData.member_id}
                      onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                      required
                    >
                      <option value="">Select Member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Trainer *</label>
                    <select
                      name="trainer_id"
                      value={formData.trainer_id}
                      onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                      required
                    >
                      <option value="">Select Trainer</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="session_date"
                      value={formData.session_date}
                      onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      name="session_time"
                      value={formData.session_time}
                      onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="15"
                    step="15"
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Schedule Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutSessionsPage;

