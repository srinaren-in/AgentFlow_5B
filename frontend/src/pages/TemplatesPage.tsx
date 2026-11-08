import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workflowService } from '@/services/workflowService'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Layers, ArrowRight } from 'lucide-react'

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
          <h1 className="text-2xl font-semibold text-[#161616] tracking-tight">Workflow Templates</h1>
          <p className="text-xs text-[#8F8F8F] font-mono mt-0.5">
            Kickstart your AI agent architecture with proven engineering pipeline designs.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#F8CDD6]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-full transition-colors whitespace-nowrap font-medium cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FFBCCA] text-[#212121] font-bold shadow-xs'
                : 'text-[#8F8F8F] hover:text-[#161616] hover:bg-[#FFE4E9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col justify-between hover:border-[#F0AEC0]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#161616] bg-[#FFE4E9] px-2.5 py-0.5 rounded-full border border-black/5">
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

              <h3 className="text-base font-semibold text-[#161616] mb-1.5">
                {template.name}
              </h3>
              <p className="text-xs text-[#8F8F8F] line-clamp-3 mb-4 leading-relaxed">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono uppercase text-[#303030] bg-[#FFF0F3] border border-[#F8CDD6] px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#FFF0F3] border-t border-[#FFE4E9] flex items-center justify-between">
              <span className="text-xs font-mono text-[#8F8F8F] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {template.nodesCount} NODES
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUseTemplate(template.name, template.tags)}
                rightIcon={<ArrowRight className="w-3 h-3" />}
              >
                USE TEMPLATE
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
