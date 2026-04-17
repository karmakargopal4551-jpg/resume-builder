import react from 'react'
import React, { useEffect, useState } from 'react'
import { Plus, UploadCloud, FilePen, Pencil, Trash, X, LoaderCircleIcon } from 'lucide-react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from "react-hot-toast";
import api from "../configs/api";

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth)

  const colors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState("")
  const [resumeId, setResumeId] = useState("null")
  const [editResume, setEditResume] = useState(false)
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false)


  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", { headers: { Authorization: `Bearer ${token}` } })
      setAllResumes(data.resumes);
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  // create resume
  const createResume = async (event) => {
    try {
      event.preventDefault();

      const token = localStorage.getItem("token");

      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);

      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };



  // upload resume
  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", resume);
      formData.append("title", title);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);

      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };



  // edit resume
  const editResumehandler = (event) => {
    event.preventDefault();

    setShowUploadResume(false)
    navigate(`/app/builder/${editResumeId}`) // Navigate to the resume builder page with the new resume ID
  };


  // edit title
  const editTitle = async (event) => {
    try {
      event.preventDefault();

      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: JSON.stringify({ title }),
        },
        {
          headers: { Authorization: token },
        }
      );

      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId
            ? { ...resume, title }
            : resume
        )
      );

      setTitle("");
      setEditResumeId("");

      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };


  // delete resume
const deleteResume = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (confirmDelete) {
      const { data } = await api.delete(
        `/api/resumes/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }, 
        }
      );

      toast.success(data.message);

      setAllResumes(
        allResumes.filter((resume) => resume._id !== id)
      );
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
};



    useEffect(() => {
      loadAllResumes()
    }, [])

    return (
      <div>
        <div className='max-w-7xl mx-auto py-10'>

          <p className='text-2xl from media mb-6 bg-linear-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'>Welcome to, Joe Doe</p>

        </div>

        <div className='flex gap-4'>
          <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <Plus className='size-11 transition-all duration-300 p-2.5 bg-linear-to-r from-indigo-300 to-indigo-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
          </button>

          <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <UploadCloud className='size-11 transition-all duration-300 p-2.5 bg-linear-to-r from-indigo-300 to-purple-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
          </button>
        </div>

        <hr className='border-slate-300 my-6 sm:w-[305px]' />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              // <button key={index} onClick={() => navigate(`/app/builder/${resume._id}`)}
              <button key={index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePen
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor + "80" }}
                >
                  {resume.title}
                </p>
                <p>
                  Updated on{" "}
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div onClick={e => e.stopPropagation} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <Trash onClick={() => { deleteResume(resume._id) }} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                  <Pencil onClick={() => { setEditResumeId(resume._id); setEditResume(true); setTitle(resume.title) }} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors' />
                </div>

              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 ">
        </div>

        {showCreateResume && (
          <form onSubmit={createResume} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div className='relative bg-white rounded-lg p-8 w-full max-w-md mx-4'>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder='Enter resume title'
                className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
                required
              />

              <button
                type="submit"
                className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
              >
                Create Resume
              </button>

              <X
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle('');
                }}
              />
            </div>
          </form>
        )}


        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-white rounded-lg p-8 w-full max-w-md mx-4'>
              <h2 className='text-xl font-bold mb-4'>Upload a Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

              <div>
                <label htmlFor="resume-input" className='flex flex-col items-center gap-2 cursor-pointer border border-dashed border-slate-400 rounded py-6 mb-4'>
                  Select a file to upload
                  <div className='text-slate-500 text-sm'>or drag and drop here
                    {resume ? (
                      <p className='text-green-700'>{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className='size-11 transition-all duration-300 p-2.5 bg-linear-to-r from-indigo-300 to-purple-500 text-white rounded-full' />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input id="resume-input" type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} className='hidden' />
              </div>

              <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white' />}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
              </button>

              <X
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => {
                  setShowUploadResume(false); setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {editResume && (
          <form onSubmit={editTitle} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div className='relative bg-white rounded-lg p-8 w-full max-w-md mx-4'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume</h2>
              <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600 required ' />

              <button onClick={editResumehandler} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                Edit Resume
              </button>

              <X
                className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'
                onClick={() => {
                  setEditResumeId(null); setEditResume(false); setTitle('')
                }}
              />
            </div>
          </form>
        )}


      </div>
    )
  }


export default Dashboard
