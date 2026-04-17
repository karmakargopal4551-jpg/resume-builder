import react from 'react'
import React, { use, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
// import { dummyResumeData } from '../assets/assets'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import {
  ArrowLeftIcon,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon
} from 'lucide-react'

import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from "../components/ResumePreview"
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"


const ResumeBuilder = () => {

  const { resumeId } = useParams()

  const { token } = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    template: 'classic',
    accent_color: '#000000',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [showColor, setShowColor] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(
        `/api/resumes/get/${resumeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadExistingResume()
  }, [])

  // close dropdown on outside click
  useEffect(() => {
    const handleClick = () => {
      setShowTemplate(false)
      setShowColor(false)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  const handleShare = () => {
    const resumeUrl = `${window.location.origin}/view/${resumeId}`

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      alert('Share not supported. Copy this link: ' + resumeUrl)
    }
  }

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put(
        "/api/resumes/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  const downloadResume = async () => {
    const element = document.getElementById("resume-preview")

    if (!element) {
      alert("Resume preview not found")
      return
    }

    // 🔥 Fix OKLCH colors before html2canvas processes them
    const allElements = element.querySelectorAll("*")
    const elementBackups = []

    allElements.forEach(el => {
      const backup = {
        el,
        originalColor: el.style.color,
        originalBgColor: el.style.backgroundColor,
        originalBorderColor: el.style.borderColor,
        originalOutlineColor: el.style.outlineColor,
      }
      elementBackups.push(backup)

      const style = window.getComputedStyle(el)

      // Convert oklch colors to safe fallbacks
      if (style.color && (style.color.includes("oklch") || style.color.includes("color("))) {
        el.style.color = "#000000"
      }

      if (style.backgroundColor && (style.backgroundColor.includes("oklch") || style.backgroundColor.includes("color("))) {
        el.style.backgroundColor = "transparent"
      }

      if (style.borderColor && (style.borderColor.includes("oklch") || style.borderColor.includes("color("))) {
        el.style.borderColor = "#cccccc"
      }

      if (style.outlineColor && (style.outlineColor.includes("oklch") || style.outlineColor.includes("color("))) {
        el.style.outlineColor = "#000000"
      }
    })

    try {
      // Capture full content with retries
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")

      const pageWidth = 210
      const pageHeight = 295

      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      //  First page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      //  Add more pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save("resume.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to download resume. Please try again.")
    } finally {
      // Restore original styles
      elementBackups.forEach(backup => {
        backup.el.style.color = backup.originalColor
        backup.el.style.backgroundColor = backup.originalBgColor
        backup.el.style.borderColor = backup.originalBorderColor
        backup.el.style.outlineColor = backup.originalOutlineColor
      })
    }
  }


  const saveResume = async () => {
    try {
      let updatedResumeData = structuredClone(resumeData);

      if (typeof resumeData.personal_info.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }

      if (typeof resumeData.personal_info.image === "object") {
        formData.append("image", resumeData.personal_info.image);
      }

      // ✅ FORCE TOKEN FROM LOCAL STORAGE
      const token = localStorage.getItem("token");

      // ✅ DEBUG (IMPORTANT)
      console.log("TOKEN:", token);

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data",data);

      setResumeData(data.resume);
      toast.success(data.message);

    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };



  const generateSummary = async () => {
    try {
      setIsGenerating(true)

      const prompt = `enhance my professional summary "${resumeData.professional_summary}"`

      const response = await api.post(
        '/api/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setResumeData(prev => ({
        ...prev,
        professional_summary: response.data.enhancedContent
      }))

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>

      <div className='max-w-6xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='flex items-center gap-1 text-slate-700 hover:text-slate-900'>
          <ArrowLeftIcon className='size-5' />
          Back to Dashboard
        </Link>
      </div>

      <div className='max-w-6xl mx-auto px-4 pb-10'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* LEFT PANEL */}
          <div className='lg:col-span-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-visible'>

            {/* Progress */}
            <div className='relative mb-6'>
              <div className="h-1 bg-gray-200 rounded-full"></div>
              <div
                className="absolute top-0 left-0 h-1 bg-green-500 rounded-full transition-all"
                style={{ width: `${activeSectionIndex * 100 / (sections.length - 1)}%` }}
              ></div>
            </div>

            {/* NAV */}
            <div className="flex justify-between items-center mb-4 border-b pb-3">

              <div className="text-sm text-gray-500">
                {activeSection.name}
              </div>

              {/* TEMPLATE + ACCENT */}
              <div className="flex items-center gap-3">

                {/* TEMPLATE */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTemplate(prev => !prev)
                    setShowColor(false)
                  }}
                  className="relative px-3 py-1.5 bg-blue-100 text-blue-600 text-sm rounded-md cursor-pointer"
                >
                  Template

                  {showTemplate && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full mt-2 left-0 z-[999] w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-3"
                    >
                      <TemplateSelector
                        selectedTemplate={resumeData.template}
                        onChange={(template) => {
                          setResumeData(prev => ({ ...prev, template }))
                          setShowTemplate(false)
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* ACCENT */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowColor(prev => !prev)
                    setShowTemplate(false)
                  }}
                  className="relative px-3 py-1.5 bg-purple-100 text-purple-600 text-sm rounded-md cursor-pointer"
                >
                  Accent

                  {showColor && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full mt-2 left-0 z-[999] bg-white rounded-xl shadow-lg border border-gray-200 p-3"
                    >
                      <ColorPicker
                        value={resumeData.accent_color}
                        onChange={(color) =>
                          setResumeData(prev => ({ ...prev, accent_color: color }))
                        }
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* NEXT */}
              <div className='flex items-center gap-2'>
                {activeSectionIndex !== 0 && (
                  <button
                    onClick={() => setActiveSectionIndex(prev => prev - 1)}
                    className='flex items-center gap-1 px-3 py-1 text-sm rounded-md hover:bg-gray-100'
                  >
                    <ChevronLeft className='size-4' />
                  </button>
                )}

                <button
                  onClick={() => setActiveSectionIndex(prev => prev + 1)}
                  disabled={activeSectionIndex === sections.length - 1}
                  className='flex items-center gap-1 px-3 py-1 text-sm rounded-md hover:bg-gray-100 disabled:opacity-40'
                >
                  Next <ChevronRight className='size-4' />
                </button>
              </div>

            </div>

            {/* FORM */}
            {activeSection.id === 'personal' && (
              <PersonalInfoForm
                data={resumeData.personal_info}
                onChange={(data) =>
                  setResumeData(prev => ({
                    ...prev,
                    personal_info: data
                  }))
                }
                removeBackground={removeBackground}
                setRemoveBackground={setRemoveBackground}
              />
            )}

            {/* SUMMARY SECTION */}
            {activeSection.id === 'summary' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Professional Summary</h2>

                  <button
                    onClick={generateSummary}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {isGenerating ? "Enhancing..." : "AI Enhance"}
                  </button>
                </div>

                <textarea
                  value={resumeData.professional_summary} 
                  onChange={(e) =>
                    setResumeData(prev => ({
                      ...prev,
                      professional_summary: e.target.value
                    }))
                  }
                  className="w-full h-32 border rounded-lg p-3 outline-none"
                  placeholder="Write your summary..."
                />
              </div>
            )}

            {/* EXPERIENCE SECTION */}
            {activeSection.id === 'experience' && (
              <ExperienceForm
                data={resumeData.experience}
                onChange={(data) =>
                  setResumeData(prev => ({
                    ...prev,
                    experience: data
                  }))
                }
              />
            )}

            {/* EDUCATION SECTION */}
            {activeSection.id === 'education' && (
              <EducationForm
                data={resumeData.education}
                onChange={(data) =>
                  setResumeData(prev => ({
                    ...prev,
                    education: data
                  }))
                }
              />
            )}

            {/* PROJECTS */}
            {activeSection.id === 'projects' && (
              <ProjectForm
                data={resumeData.projects}
                onChange={(data) =>
                  setResumeData(prev => ({
                    ...prev,
                    projects: data
                  }))
                }
              />
            )}

            {/* Skills*/}
            {activeSection.id === 'skills' && (
              <SkillsForm
                data={resumeData.skills}
                onChange={(data) =>
                  setResumeData(prev => ({
                    ...prev,
                    skills: data
                  }))
                }
              />
            )}

            {/* Save Button */}
            <div className="mt-6">
              <button onClick={() => { toast.promise(saveResume, { loading: "Saving..." }) }}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            </div>

          </div>



          {/* RIGHT PANEL */}
          <div className="lg:col-span-6 bg-gray-50 rounded-xl border p-6 sticky top-10 h-fit">

            {/*Buttens for public, private, downlode */}
            <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>

                  {resumeData.public && (
                    <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                      <Share2Icon className='size-4' />
                    </button>
                  )}

                  <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                    {resumeData.public ? (
                      <EyeIcon className="size-4" />
                    ) : (
                      <EyeOffIcon className="size-4" />
                    )}
                    {resumeData.public ? 'Public' : 'Private'}
                  </button>

                  <button onClick={downloadResume} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 ring-green-300 rounded-lg hover:ring transition-colors'>
                    <DownloadIcon className="size-4" />
                    Download
                  </button>

                </div>
              </div>
            </div>

            <div className="scale-110 origin-top">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                removeImageBackground={removeBackground}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder