import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/Button";
import { Image } from "../../../components/Image";
import { Title } from "../../../components/Title";
import trebleClef from '../../../images/music-notes.png'
import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import classes from './styles/styles.module.css'
import { toast } from 'react-toastify'
import { Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { Input } from '../../../components/Input'
import { Loading } from '../../../components/Loading'
import { useContextApi } from "../../../context/hooks/useContextApi";

export function SheetMusic() {
  
  const { isLoading, setIsLoading } = useContextApi()

  const navigate = useNavigate()
  
  const [pdf, setPdf] = useState([])
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfFileName, setPdfFileName] = useState('')
  const [compositor, setCompositor] = useState('')
  
  useEffect(() => {
    document.title = 'Partituras'
  }, [])
  
  const allowedFiles = ['application/pdf']
  
  const handlePdfFile = async (event) => {
    let selectedFile = event.target.files[0]
    setPdfFileName(event.target.files[0].name)
    setPdf(event.target.files[0])

    const numbersFiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    for(const number of numbersFiles) {
      if(event.target.files[0].name.includes(number)) {
        toast.error('O nome do arquivo não pode conter números.')
        setPdfFile(null)
        return
      }
    }
    
    if(selectedFile) {
      
      if(selectedFile && allowedFiles.includes(selectedFile.type)) {
        let reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = (event) => {
          setPdfFile(event.target.result)
        }
      }
    }else{
      console.log('Escolha um PDF.')
    }
  }
  
  const handleSheetMusic = async () => {
    
    setIsLoading(true)
    
    try {
      
      const userData = new FormData()
      
      userData.append('pdf', pdf)

      userData.append('compositor', compositor)
      
      const response = await api.post('/salvarPartitura', userData)
  
      if(response.status === 200) {
        setIsLoading(false)
        navigate('/maestro')
        return toast.success('Partitura salva com sucesso!')
      }
  
      throw new Error('Arquivo não permitido. Por favor, tente novamente.')
      
    } catch (error) {
      console.info(error.message)
      console.error(error.name)

      const { status } = error.request
      console.warn(status)

      setIsLoading(false)
      
      if(status !== 200) {
        return toast.error(error.message)
      }

    }

  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    setPdfFileName('')
    setCompositor('')
    setPdfFile(null)
    handleSheetMusic()
  }

  useEffect(() => {
    return () => setIsLoading(false)
  }, [])

  const isDisabled = !pdfFile || !compositor
  
  return (
    <section className="container-body-login">
      <Link to='/maestro' title='Login'>
        <FaArrowLeft size={40} color='#131313' className="arrow-left" />
      </Link>

      <div className="container-login-register">
        { pdfFile ? (
          <div className={`container-image`}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfFile} />
            </Worker>
          </div>
        ) : (
          <Image 
            className='container-image'
            src={ trebleClef }
            alt='Clave de Sol'
          />
        ) }
        
        <div className={`form-container ${classes.form_container_sheetMusic}`}>
          <Title 
            classNameContainer='form-header'
            id='form-header-register'
            classNameTitle='login-title'
            textTitle='Partituras'
          />

          <form method='post' encType="multipart/form-data" onSubmit={handleSubmit} className={`form-login ${classes.form_files}`}>

            <Input 
              label='Arranjador:'
              htmlFor='Arranjador'
              placeholder='Arranjador'
              value={compositor}
              onChange={event => setCompositor(event.target.value)}
            />
            
            <div className={`${isLoading ? classes.isLoading : classes.input_block}`}>

              <label htmlFor="file">Arquivo:</label>
              <label htmlFor="file" className={classes.inputFile}>
                <span className={pdfFile ? classes.hasPdfFile: classes.inputFile_custom}>
                  { pdfFile ? pdfFileName.slice(0, 21): null }
                </span> 
                <input 
                  type="file" 
                  name="pdf"
                  accept=".pdf"
                  id='file'
                  onChange={handlePdfFile}
                />
              </label>
            </div>

            <Button 
              type='submit'
              className={`button-login isButtonDisabled ${classes.save_button}`}
              disabled={ isDisabled }
            >
              Salvar
            </Button>
            
          </form>

          { isLoading ? <Loading /> : null }

        </div>
        
      </div>
    </section>
  )
}