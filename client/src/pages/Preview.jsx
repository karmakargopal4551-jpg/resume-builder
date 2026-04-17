import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import { ArrowLeftIcon, Loader } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {

  const { resumeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)

  const [resumeData, setResumeData] = useState(null)
  console.log("resumeID", resumeId)

  const loadResume = async () => {
    const response = await api.get(
        `/api/resumes/get/${resumeId}`)
    setResumeData(response.data.resume)
    setIsLoading(false)
  }
  
  console.log("resumeData", resumeData)

  useEffect(() => {
    loadResume()
  },[])

  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template}
                        accentColor={resumeData.accent_color}
                        classes='py-10 bg-white'/>
      </div>
    </div>
  ) : (
      <div>
        {isLoading ? <Loader/> :(
        <div className='flex flex-col items-center justify-self-center-safe '>
          <p className='text-center text-6xl text-slate-400 font-medium'>
            Resume not found
          </p>
          <a href="" className='mt-6 flex items-center gap-2 text-sm text-blue-600 hover:underline'>
            <ArrowLeftIcon className='mr-2 size-4'/>
            go to home page
          </a>
        </div>
        )}
      </div>
  )
}

export default Preview
