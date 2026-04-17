import React, { useState } from "react"
import { Sparkles } from "lucide-react"

const SkillsForm = ({ data = [], onChange }) => {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Skills</h3>
        <p className="text-sm text-gray-500">Add your skills here</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a skill..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {data.length > 0 ? (
        <div className="space-y-2">
          {data.map((skill, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
              <span>{skill}</span>
              <button
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-2">
          <Sparkles className="w-10 h-10 mx-auto text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Add your technical and soft skills above.</p>
        </div>
      )}

      <div>
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
        </p>
      </div>
    </div>
  )
}

export default SkillsForm