'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Project = {
  id: string
  title: string
  description: string
  start_date: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProjects(data)
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !startDate) return
    await supabase.from('projects').insert([{ title, description, start_date: startDate }])
    setTitle('')
    setDescription('')
    setStartDate('')
    fetchProjects()
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <form onSubmit={createProject} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
        <button className="bg-black text-white px-4 py-2 rounded" type="submit">
          Create Project
        </button>
      </form>
      <ul>
        {projects.map(project => (
          <li key={project.id} className="border-b py-2">
            <div className="font-semibold">{project.title}</div>
            <div className="text-sm text-gray-600">{project.description}</div>
            <div className="text-xs text-gray-400">Start: {project.start_date}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
