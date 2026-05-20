import { useState, useEffect } from 'react'
import { teamsApi } from '../services/api'
import TeamCard from '../components/Teamcard.jsx'
import { TeamFormModal } from '../components/Teamformmodal.jsx'
import { LoadingPage, EmptyState } from '../components/ui/index.jsx'
import useAuthStore from '../context/Authstore.js'
import toast from 'react-hot-toast'

export default function Teams() {
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState({ open: false, team: null })
  const { user } = useAuthStore()

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await teamsApi.getAll()
      setTeams(data.teams)
    } catch {
      toast.error('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleTeamSaved = (savedTeam) => {
    setTeams(prev => {
      const exists = prev.find(t => t.id === savedTeam.id)
      if (exists) return prev.map(t => t.id === savedTeam.id ? savedTeam : t)
      return [savedTeam, ...prev]
    })
  }

  const handleDelete = async (team) => {
    if (!confirm(`Delete "${team.name}"? This will also delete all tasks in this team.`)) return
    try {
      await teamsApi.delete(team.id)
      setTeams(prev => prev.filter(t => t.id !== team.id))
      toast.success('Team deleted')
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  if (loading) return <LoadingPage />

  return (
    <div style={{
      padding: '28px 32px',
      maxWidth: 1280,
      margin: '0 auto',
      width: '100%',
      animation: 'fadeUp 0.35s var(--ease-spring) both',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700,
            color: 'var(--surface-900)',
            letterSpacing: '-0.03em', margin: 0,
          }}>Teams</h1>
          <p style={{ fontSize: 13, color: 'var(--surface-500)', marginTop: 2 }}>
            {teams.length} team{teams.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, team: null })}
          className="btn-primary"
        >
          + New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          icon="◈"
          title="No teams yet"
          description="Create your first team and start collaborating with your colleagues"
          action={
            <button
              onClick={() => setFormModal({ open: true, team: null })}
              className="btn-primary"
            >
              + Create Team
            </button>
          }
        />
      ) : (
        /* Responsive grid via inline style + style tag */
        <>
          <div className="teams-grid" style={{ display: 'grid', gap: 16 }}>
            {teams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                currentUserId={user?.id}
                onEdit={(t) => setFormModal({ open: true, team: t })}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <style>{`
            .teams-grid { grid-template-columns: 1fr; }
            @media (min-width: 768px)  { .teams-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (min-width: 1280px) { .teams-grid { grid-template-columns: repeat(3, 1fr); } }
          `}</style>
        </>
      )}

      <TeamFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, team: null })}
        onSuccess={handleTeamSaved}
        team={formModal.team}
      />
    </div>
  )
}