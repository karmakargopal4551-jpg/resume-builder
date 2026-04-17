import React from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const ProjectForm = ({ data = [], onChange = () => {} }) => {

    const addProject = () => {
        const newProject = {
            name: '',
            type: '',
            description: ''
        };
        onChange([...data, newProject]);
    };

    const removeProject = (index) => {
        const updatedProjects = data.filter((_, i) => i !== index);
        onChange(updatedProjects);
    }

    const updateProject = (index, field, value) => {
        const updatedProjects = data.map((project, i) =>
            i === index ? { ...project, [field]: value } : project
        );
        onChange(updatedProjects);
    }


  return (
    <div>

            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                        <GraduationCap className='w-5 h-5' />
                        Projects
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add your projects
                    </p>
                </div>

                <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                    <Plus className='size-4' />
                    Add Project
                </button>
            </div>
            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No projects added yet.</p>
                    <p className="text-sm">Click "Add Project" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((project, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <h4>Project #{index + 1}</h4>
                                <button
                                    onClick={() => removeProject(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    value={project.name || ""}
                                    onChange={(e) =>
                                        updateProject(index, "name", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Name"
                                    className="px-3 py-2 text-sm rounded-lg"
                                />

                                <input
                                    value={project.type || ""}
                                    onChange={(e) =>
                                        updateProject(index, "type", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Type"
                                    className="px-3 py-2 text-sm rounded-lg"
                                />

                                <textarea
                                    value={project.description || ""}
                                    onChange={(e) =>
                                        updateProject(index, "description", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Description"
                                    className="px-3 py-2 text-sm rounded-lg"
                                />

                                <input
                                    value={project.link || ""}
                                    onChange={(e) =>
                                        updateProject(index, "link", e.target.value)
                                    }
                                    type="text"
                                    placeholder="Project Link"
                                    className="px-3 py-2 text-sm rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectForm