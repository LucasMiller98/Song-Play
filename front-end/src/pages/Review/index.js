import { Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useContextApi } from '../../context/hooks/useContextApi'
import { api } from '../../services/api'
import classes from './styles/review.module.css'

export function Review() {

  const [documento, setDocumento] = useState([])

  const { setNome, setCodigo } = useContextApi()

  const { id } = useParams()

  useEffect(() => {
    const getSheetMusic = async () => {
      try {
        const { data } = await api.get('/listarPartitura')
        setDocumento(data)
        
        return data
      } catch (error) {
        console.error(error.name)
        console.info(error.message)
      }
    }
    getSheetMusic()
  }, [])
  
  useEffect(() => {
    setNome(localStorage.getItem('name'))
    setCodigo(localStorage.getItem('id'))
  }, [])
  
  return (
    <div className={classes.container}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
        <Viewer fileUrl={documento} />
        
      </Worker>

    </div>
  )
}