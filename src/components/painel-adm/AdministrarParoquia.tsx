import React, { useState, useEffect } from "react";
import "../../styles/AdmParoquia.css";
import { ObjectId } from "mongodb";
import api from "../../apiConfig";


const authToken = sessionStorage.getItem("token");

interface ParoquiaModel {
  _id: ObjectId | string;
  NomeParoquia: string;
  Padres: string;
  CEP: string;
  LocalizacaoParoquia: string;
  Bairro: string;
  InformacoesAdicionais: string;
  EmailResponsavel: string;
}

function AdministrarParoquia() {
  const [paroquiaDados, setParoquiaDados] = useState<ParoquiaModel>({
    _id: "",
    NomeParoquia: "",
    Padres: "",
    CEP: "",
    LocalizacaoParoquia: "",
    Bairro: "",
    InformacoesAdicionais: "",
    EmailResponsavel: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParoquiaDados((prevParoquia) => ({
      ...prevParoquia,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchParoquiaData = async () => {
      try {
        const response = await api.get("/api/paroquia-mais-frequentada", {
          headers: {
            Authorization: authToken,
          },
        });
        setParoquiaDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da paróquia", error);
      }
    };

    fetchParoquiaData();
  }, []); // O segundo argumento vazio faz com que este useEffect execute apenas uma vez

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.patch("/api/paroquias/:id", paroquiaDados, {
        headers: {
          Authorization: authToken,
        },
      });
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações", error);
      alert(
        "Erro ao salvar alterações. Verifique o console para mais detalhes."
      );
    }
  };

  return (
    <div className="administrar-paroquia">
      <div className="cadastro-container">
        <div className="cadastro-central">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <h2>Administrar Paróquia</h2>

            <label htmlFor="NomeParoquia">Nome da Paróquia:</label>
            <input
              type="text"
              id="NomeParoquia"
              name="NomeParoquia"
              value={paroquiaDados.NomeParoquia}
              required
              onChange={handleInputChange}
            />

            <label htmlFor="Padres">Padres:</label>
            <input
              id="Padres"
              name="Padres"
              value={paroquiaDados.Padres}
              placeholder="Escreva o nome do(s) padre(s)"
              required
              onChange={handleInputChange}
            />

            <label htmlFor="CEP">CEP:</label>
            <input
              type="text"
              id="CEP"
              name="CEP"
              value={paroquiaDados.CEP}
              required
              onChange={handleInputChange}
            />

            <label htmlFor="LocalizacaoParoquia">
              Localização da Paróquia:
            </label>
            <input
              type="text"
              id="LocalizacaoParoquia"
              name="LocalizacaoParoquia"
              value={paroquiaDados.LocalizacaoParoquia}
              required
              onChange={handleInputChange}
            />

            <label htmlFor="Bairro">Bairro:</label>
            <input
              type="text"
              id="Bairro"
              name="Bairro"
              value={paroquiaDados.Bairro}
              required
              onChange={handleInputChange}
            />

            <label htmlFor="InformacoesAdicionais">
              Informações Adicionais:
            </label>
            <textarea
              className="descricaoPersonalizadatextarea"
              id="InformacoesAdicionais"
              name="InformacoesAdicionais"
              value={paroquiaDados.InformacoesAdicionais}
              onChange={handleInputChange}
            />

            <label htmlFor="EmailResponsavel">Email do Responsável:</label>
            <input
              type="email"
              id="EmailResponsavel"
              name="EmailResponsavel"
              value={paroquiaDados.EmailResponsavel}
              required
              onChange={handleInputChange}
            />

            <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdministrarParoquia;
