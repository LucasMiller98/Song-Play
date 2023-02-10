import React, {useEffect, useState} from "react";
import { api } from '../../services/api';
import { toast } from "react-toastify";
import { useContextApi } from '../../context/hooks/useContextApi'
import { Loading } from '../../components/Loading'
import { Link, useNavigate } from "react-router-dom";

const ListagemMusico = () => {

  // const { isLoading, setIsLoading } = useContextApi()
  
 
  const [partituras, SetPartituras] = useState([]);
  // const [atualizar, setAtualizar] = useState([]);
  const [pesquisar, setPesquisar] = useState("");
  const [download, setDownload] = useState('')

  console.log(download)
  
  const navigate = useNavigate()

    // const Erro = () => {
    //     navigate('/erro')    
    // }
 
 
  useEffect(()=>{
   buscarPartituras();
  },[]);

  async function buscarPartituras() {

    try {
      // setIsLoading(true)

      const result = await api.get('/listarPartitura')
      SetPartituras(result.data)

      // if(result.status === 200) {
      //   setIsLoading(false)
      //   return
      // }

    } catch (error) {
      // setIsLoading(false)
      console.error(error.name)
      console.info(error.message)
      
    }
  }

  function handleDownloadSheetMusic(id) {

    api.get(`/baixarPartitura/${id}`)
      .then(response => {
        setDownload(response.data)
      })
      .catch(error => {
        console.log(error)
      })

  }

  // useEffect(() => {
  //   return () => setIsLoading(false)
  // }, [])

  return (
    
    <div className="container listas ">
    <button onClick={buscarPartituras()}  data-bs-toggle="collapse" data-bs-target="#partitura"type="button" className="btn btn-color">Listar Todas Partituras</button>&nbsp;&nbsp;  

    <table id ="partitura" className="table collapse">
    <input  type="text" className="form-control input-pesqu"      placeholder="Pesquise por nome" aria-label="Recipient's username"
     aria-describedby="button-addon2"  onChange={(e)=>{
       setPesquisar(e.target.value);
     }}/>
    <tbody>
      <h3 className="titulo-list">Lista de todas as partituras</h3>
      <tr>
        <th scope="col">Nome</th>
        {/* <th scope="col">Compositor</th> */}
        <th scope="col">Opções</th>
      </tr>
    </tbody>

    <tbody>
      {
        partituras.filter(val=>{
          if (pesquisar === ''){
            return val;   
          } else if (
            val.nome.toLowerCase().includes(pesquisar.toLowerCase()) 
            // val.codigoMaestro.nome.toLowerCase().includes(pesquisar.toLowerCase())
          )  {
            return val
          }
        }).map(part=>(
        <React.Fragment key={part.id}>
      <tr>
        <td>{part.nome}</td>
        {/* <td>{part.compositor}</td> */}
        <td>
        {/* <button onClick={Erro} type="button" className="btn btn-color">Baixar</button>&nbsp;&nbsp; */}

          <button 
            onClick={() => 
              handleDownloadSheetMusic(part.codigo)
            } 
            type="button" 
            className="btn btn-color"
          >
            Baixar
          </button>&nbsp;&nbsp;

          {/* <p>{ download }</p>  */}

          { download ? (
            <iframe style={{ 
                display: 'none' 
              }} 
              src={download}
            ></iframe>) : null }

        </td>
      </tr>
    </React.Fragment>
    ))
    }

  </tbody>
  
      {/* { isLoading ? <Loading /> : null } */}
</table>
    </div>

  );
  };
  
  export default ListagemMusico;