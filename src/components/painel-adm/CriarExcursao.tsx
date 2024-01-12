import React, { useState, useEffect } from "react";
import "../../styles/GerenciadorEventos.css";
import Select, { ActionMeta, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import api from "../../apiConfig";

const authToken = sessionStorage.getItem("token");

// Função para converter o caminho da imagem
function convertImageURL(imageURL: string) {
  // Verifica se o URL é um link do Google Drive
  const isDriveLink = /drive\.google\.com\/uc\?id=/.test(imageURL);

  if (isDriveLink) {
    return imageURL; // Se já for um link do Google Drive, retorna como está
  }
  // Verifica se o URL corresponde ao padrão para extrair o ID do arquivo de um link compartilhado do Google Drive
  const match = imageURL.match(/\/d\/(.+?)\//);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?id=${fileId}`;
  }

  return imageURL; // Retorna o URL original se não for um link do Google Drive
}

function CriarExcursao({ paroquias }: any) {
  const [excursao, setExcursao] = useState({
    NomeExcursao: "",
    DataInicioExcursao: "",
    DataFimExcursao: "",
    HoraInicioExcursao: "",
    HoraFimExcursao: "",
    LocalizacaoExcursao: "",
    DescricaoExcursao: "",
    CaminhoImagem: "",
    PrecoExcursao: 0,
    VagasExcursao: 0,
    ParoquiaID: null,
    Ocultar: false,
    Destaque: false,
  });

  const [errors, setErrors] = useState({
    NomeExcursao: "",
    DataInicioExcursao: "",
    DataFimExcursao: "",
    HoraInicioExcursao: "",
    HoraFimExcursao: "",
    LocalizacaoExcursao: "",
    DescricaoExcursao: "",
    PrecoExcursao: "",
    VagasExcursao: "",
    ParoquiaID: "",
  });

  const today = moment();
  const [paroquiasOptions, setParoquiasOptions] = useState([]);
  const [selectedParoquia, setSelectedParoquia] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (paroquias) {
      setParoquiasOptions(
        paroquias.map((paroquia: any) => ({
          value: paroquia._id,
          label: paroquia.nomeParoquia,
        }))
      );
    }
  }, [paroquias]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "CaminhoImagem") {
      const convertedImagePath = convertImageURL(value);
      setExcursao({ ...excursao, [name]: convertedImagePath });
    } else if (name === "Destaque" || name === "Ocultar") {
      // Converte o valor para booleano
      setExcursao({ ...excursao, [name]: value === "Sim" });
    } else {
      setExcursao({ ...excursao, [name]: value });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExcursao({ ...excursao, [name]: value });
  };

  const handleDateChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setExcursao({ ...excursao, [name]: moment(value).format("YYYY-MM-DD") });
  };

  const handleTimeChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setExcursao({
      ...excursao,
      [name]: moment(value, "HH:mm").format("HH:mm"),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { ...errors };

    // Adicione suas validações aqui

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      try {
        const response = await api.post("/excursoes/criar", excursao, {
          headers: {
            Authorization: authToken,
          },
        });

        if (response.status === 201) {
          console.log("A excursão foi criada com sucesso:", response.data);
          navigate("/pagina-principal-paroquia");
        } else {
          console.error("Ocorreu um erro ao criar a excursão:", response.data);
          alert(
            "Houve um problema ao criar a excursão. Por favor, tente novamente."
          );
        }
      } catch (error) {
        console.error("Ocorreu um erro ao criar a excursão:", error);
        alert(
          "Houve um problema ao criar a excursão. Por favor, tente novamente."
        );
      }
    }
  };

  return (
    <div className="administrar-excursao">
      <div className="cadastro-container">
        <div className="cadastro-central">
          <h2>Criar uma Nova Excursão</h2>
          <form className="criar-evento-form" onSubmit={handleSubmit}>
            <div>
              <label>Nome da Excursão:</label>
              {errors.NomeExcursao && (
                <span className="error">{errors.NomeExcursao}</span>
              )}
              <input
                type="text"
                name="NomeExcursao"
                placeholder="Insira um nome para a excursão"
                value={excursao.NomeExcursao}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Data de Início e Fim:</label>
              {errors.DataInicioExcursao && (
                <span className="error">{errors.DataInicioExcursao}</span>
              )}
              {errors.DataFimExcursao && (
                <span className="error">{errors.DataFimExcursao}</span>
              )}
              <div className="data-inputs">
                <input
                  type="date"
                  name="DataInicioExcursao"
                  value={moment(excursao.DataInicioExcursao).format("YYYY-MM-DD")}
                  onChange={handleDateChange}
                  required
                />
                <input
                  type="date"
                  name="DataFimExcursao"
                  value={moment(excursao.DataFimExcursao).format("YYYY-MM-DD")}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>
            <div>
              <label>Hora de Início e Fim:</label>
              <div className="hora-inputs">
                <input
                  type="time"
                  name="HoraInicioExcursao"
                  value={excursao.HoraInicioExcursao}
                  onChange={handleTimeChange}
                  required
                />
                <input
                  type="time"
                  name="HoraFimExcursao"
                  value={excursao.HoraFimExcursao}
                  onChange={handleTimeChange}
                  required
                />
              </div>
            </div>
            <div>
              <label>Localização da Excursão:</label>
              <input
                type="text"
                name="LocalizacaoExcursao"
                placeholder="Exemplo: Salão Paroquial..."
                value={excursao.LocalizacaoExcursao}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Descrição da Excursão:</label>
              <textarea
              className="descricaoPersonalizadatextarea"
                value={excursao.DescricaoExcursao}
                name="DescricaoExcursao"
                placeholder="Insira detalhes, como roteiro e informações importantes"
                onChange={handleTextareaChange}
              />
            </div>
            <div>
              <label>Imagem da Excursão:</label>
              <input
                type="text"
                name="CaminhoImagem"
                placeholder="Insira o endereço da imagem (ex: https://drive.google.com/uc?id=123456)"
                value={excursao.CaminhoImagem}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Preço da Excursão:</label>
              {errors.PrecoExcursao && (
                <span className="error">{errors.PrecoExcursao}</span>
              )}
              <input
                type="number"
                name="PrecoExcursao"
                placeholder="Insira o preço da excursão"
                value={excursao.PrecoExcursao}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Vagas da Excursão:</label>
              {errors.VagasExcursao && (
                <span className="error">{errors.VagasExcursao}</span>
              )}
              <input
                type="number"
                name="VagasExcursao"
                placeholder="Insira o número de vagas disponíveis"
                value={excursao.VagasExcursao}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Paróquia:</label>
              <Select
                options={paroquiasOptions}
                value={selectedParoquia}
                onChange={(newValue: any) => {
                  setSelectedParoquia(newValue);
                  setExcursao({ ...excursao, ParoquiaID: newValue?.value });
                }}
                placeholder="Selecione a paróquia"
              />
              {errors.ParoquiaID && (
                <span className="error">{errors.ParoquiaID}</span>
              )}
            </div>
            <div>
              <label>Deseja destacar a excursão?</label>
              <select
                name="Destaque"
                value={excursao.Destaque ? "Sim" : "Não"}
                onChange={handleChange}
              >
                <option value="Não">Não</option>
                <option value="Sim">Sim</option>
              </select>
            </div>
            <div>
              <button type="submit">Criar Excursão</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}  

export default CriarExcursao;
