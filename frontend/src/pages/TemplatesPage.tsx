import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflowService } from '@/services/workflowService'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Sparkles, Layers, ArrowRight } from 'lucide-react'

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate()
  const templates = workflowService.getTemplates()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Autonomous Agent', 'RAG Pipeline', 'Chatbot', 'API Automation']

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory)

  const handleUseTemplate = (templateName: string, tags: string[]) => {
    const created = workflowService.createWorkflow({
      name: `${templateName} (Copy)`,
      description: `Cloned from AgentFlow template: ${templateName}`,
      tags: [...tags, 'Template'],
    })
    navigate(`/editor/${created.id}`)
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workflow Templates</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kickstart your AI agent architecture with proven engineering pipeline designs.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col justify-between hover:border-slate-300">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {template.category}
                </span>
                <Badge
                  variant={
                    template.difficulty === 'Beginner'
                      ? 'success'
                      : template.difficulty === 'Intermediate'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {template.difficulty}
                </Badge>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                {template.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {template.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {template.nodesCount} Pre-wired Nodes
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUseTemplate(template.name, template.tags)}
                rightIcon={<ArrowRight className="w-3 h-3" />}
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
