import React, { useState, useEffect } from "react";
import moment from "moment";
import Select, { ActionMeta, MultiValue } from "react-select";
import '../../styles/GerenciadorEventos.css'
import { useNavigate } from "react-router-dom";
import api from '../../apiConfig';

const authToken = sessionStorage.getItem("token");


function EditarEvento({ userAccess, servicosComunitarios }: any) {
  const [servicosComunitariosOptions, setServicosComunitariosOptions] = useState([]);
  const [selectedServicosComunitarios, setSelectedServicosComunitarios] = useState([] as MultiValue<any>);
  const [eventos, setEventos] = useState([]);
  const [eventoIndex, setEventoIndex] = useState(0);
  const [evento, setEvento] = useState({
    _id:"",
    NomeEvento: "",
    DataInicio: "",
    DataFim: "",
    HoraInicio: "",
    HoraFim: "",
    LocalizacaoEvento: "",
    DescricaoEvento: "",
    CaminhoImagem: "",
    TipoEvento: "",
    IDServicoComunitario: [] as any,
    Destaque: false,
  });

  function convertImageURL(imageURL: string) {
    const match = imageURL.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?id=${fileId}`;
    }
    return imageURL;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "CaminhoImagem") {
      const convertedImagePath = convertImageURL(value);
      setEvento({ ...evento, [name]: convertedImagePath });
    } else if (name === "Destaque") {
      // Converte o valor para booleano
      setEvento({ ...evento, [name]: value === "Sim" });
    } else {
      setEvento({ ...evento, [name]: value });
    }
  };

  const fetchServicosComunitarios = async () => {
    try {
      
      const options = servicosComunitarios.map((servicoComunitario: any) => ({
        value: servicoComunitario._id,
        label: servicoComunitario.nomeServicoComunitario,
      }));
      setServicosComunitariosOptions(options);
    } catch (error) {
      console.error("Erro ao buscar serviços comunitários:", error);
    }
  };

  const fetchEventos = async () => {
    try {
      const response = await api.get("/eventos/eventos");
      setEventos(response.data);
      setEvento(response.data[eventoIndex]); // Ajuste para usar o índice correto
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchServicosComunitarios();
    fetchEventos();
  }, [eventoIndex]);
  
  const goToNextEvento = () => {
    if (eventoIndex < eventos.length - 1) {
      setEventoIndex((prevIndex) => prevIndex + 1);
    }
  };
  
  const goToPreviousEvento = () => {
    if (eventoIndex > 0) {
      setEventoIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Função para lidar com a submissão do formulário de edição
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Faça uma chamada para atualizar o evento no servidor com os dados de 'evento'
      // Certifique-se de enviar a solicitação correta para atualizar o evento
      const response = await api.put(`/eventos/editar-evento/${evento._id}`, evento, {
        headers: {
          Authorization: authToken,
        },
      });
      
      console.log("Evento atualizado:", response.data);
      navigate("/pagina-principal-paroquia");
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };
  
  return (
    <div className="EventosWrapper">
      <div className="EventosContainer">
        <div className="Container-form">
          <h2>Editar Evento</h2>
          <div className="prev-next-button">
              <button onClick={goToPreviousEvento}>Evento Anterior</button>
              <button onClick={goToNextEvento}>Próximo Evento</button>
            </div>
          <form className="editar-evento-form" onSubmit={handleEditSubmit}>
            <div>
              <label>Nome do Evento:</label>
              <input
                type="text"
                name="NomeEvento"
                value={evento.NomeEvento}
                onChange={(e) =>
                  setEvento({ ...evento, NomeEvento: e.target.value })
                }
                required
              />
            </div>
            <label>Data de início e fim</label>
            <div className="data-inputs">
              <input
                type="date"
                name="DataInicio"
                value={moment(evento.DataInicio).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setEvento({
                    ...evento,
                    DataInicio: moment(e.target.value).format("YYYY-MM-DD"),
                  })
                }
                required
              />
              <input
                type="date"
                name="DataFim"
                value={moment(evento.DataFim).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setEvento({
                    ...evento,
                    DataFim: moment(e.target.value).format("YYYY-MM-DD"),
                  })
                }
                required
              />
            </div>
            <label>Hora de início e fim</label>
            <div className="hora-inputs">
              <input
                type="time"
                name="HoraInicio"
                value={moment(evento.HoraInicio, "HH:mm").format("HH:mm")}
                onChange={(e) =>
                  setEvento({
                    ...evento,
                    HoraInicio: moment(e.target.value, "HH:mm").format("HH:mm"),
                  })
                }
                required
              />
              <input
                type="time"
                name="HoraFim"
                value={moment(evento.HoraFim, "HH:mm").format("HH:mm")}
                onChange={(e) =>
                  setEvento({
                    ...evento,
                    HoraFim: moment(e.target.value, "HH:mm").format("HH:mm"),
                  })
                }
                required
              />
            </div>
            <div>
              <label>Localização do Evento:</label>
              <input
                type="text"
                name="LocalizacaoEvento"
                value={evento.LocalizacaoEvento}
                onChange={(e) =>
                  setEvento({ ...evento, LocalizacaoEvento: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Descrição do Evento:</label>
              <textarea
                className="descricaoEventotextarea"
                name="DescricaoEvento"
                value={evento.DescricaoEvento}
                onChange={(e) =>
                  setEvento({ ...evento, DescricaoEvento: e.target.value })
                }
              />
            </div>
            <div>
              <label>Imagem do Evento:</label>
              <input
                type="text"
                name="CaminhoImagem"
                placeholder="Insira o endereço de sua imagem aqui!"
                value={evento.CaminhoImagem}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Tipo de Evento:</label>
              <input
                type="text"
                name="TipoEvento"
                value={evento.TipoEvento}
                onChange={(e) =>
                  setEvento({ ...evento, TipoEvento: e.target.value })
                }
              />
            </div>
            <div>
              <label>Serviço Comunitário:</label>
              <Select
  options={servicosComunitariosOptions}
  value={selectedServicosComunitarios}
  onChange={(newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
    if (actionMeta.action === "select-option") {
      setSelectedServicosComunitarios(newValue);
      setEvento({
        ...evento,
        IDServicoComunitario: newValue.map((option: any) => option.value),
      });
    } else if (actionMeta.action === "remove-value") {
      setSelectedServicosComunitarios(newValue);
      setEvento({
        ...evento,
        IDServicoComunitario: newValue.map((option: any) => option.value),
      });
    }
  }}
  isMulti
  placeholder="Selecione ou digite para buscar serviços comunitários"
/>
            </div>
            <div>
              <label>Deseja destacar seu evento?</label>
              <select
                name="Destaque"
                value={evento.Destaque ? "Sim" : "Não"} // Mostra "Sim" ou "Não"
                onChange={handleChange}
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <button type="submit">Salvar Edições</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarEvento;
