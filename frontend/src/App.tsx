import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { WorkflowEditorPage } from '@/pages/WorkflowEditorPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { ModelProvidersPage } from '@/pages/ModelProvidersPage'
import { SettingsPage } from '@/pages/SettingsPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="editor" element={<WorkflowEditorPage />} />
          <Route path="editor/:id" element={<WorkflowEditorPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="providers" element={<ModelProvidersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
