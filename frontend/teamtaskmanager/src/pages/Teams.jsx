import { useState, useEffect } from 'react'
import { teamsApi } from '../services/api'
import TeamCard from '../components/TeamCard'
import TeamFormModal from '../components/TeamFormModal'
import { LoadingPage, EmptyState } from '../components/ui/index.jsx'
import useAuthStore from '../context/authStore'
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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Teams</h1>
          <p className="text-surface-500 text-sm mt-0.5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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