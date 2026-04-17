import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { toast } from 'react-toastify'

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {

  console.log("SUMMARY COMPONENT RENDERED") 

  const { token } = useSelector(state => state.auth)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSummary = async () => {
    try {
      setIsGenerating(true)

      const prompt = `enhance my professional summary "${data}"`

      // ✅ FIX 1: use correct variable (data instead of userContent)
      if (!data || data.trim().length < 10) {
        toast.error("Please write a longer summary first");
        setIsGenerating(false);
        return;
      }

      // ✅ DEBUG (optional but helpful)
      console.log("SUMMARY SENDING:", prompt);

      const response = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ FIX 2
      )

      setResumeData(prev => ({
        ...prev,
        professional_summary: response.data.enhancedContent
      }))

    } catch (error) {
      console.log("AI ERROR:", error?.response?.data);
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-4'>
      
      <div className='flex items-center justify-between gap-4'>
        
        <div className="flex-1">
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Summary
          </h3>
          <p className='text-sm text-gray-500'>
            Add summary for your resume here
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className='flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 shrink-0'
        >
          {isGenerating ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Sparkles className='size-4' />
          )}

          {isGenerating ? 'Enhancing...' : "AI Enhance"}
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary..."
        />

        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          Save Changes
        </button>

        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          {isGenerating ? "Generating..." : "✨ AI Enhance"}
        </button>
      </div>

    </div>
  )
}

export default ProfessionalSummaryForm