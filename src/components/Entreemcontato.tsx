import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../styles/Entreemcontato.css'
import api from "../apiConfig";
import { ObjectId } from "mongodb";


interface ParoquiaModel {
  _id: ObjectId;
  NomeParoquia: string;
  Padres: string;
  CEP: string;
  LocalizacaoParoquia: string;
  Bairro: string;
  InformacoesAdicionais: string;
  EmailResponsavel: string;
}
interface EntreEmContatoProps {
  paroquiaSelecionada: ParoquiaModel | null; // Certifique-se de que a paróquia seja passada como prop
}

const EntreEmContato: React.FC<EntreEmContatoProps> = ({
  paroquiaSelecionada,
}) => {
  const [formData, setFormData] = useState({
    NomeUsuario: "",
    Email: "",
    Mensagem: "",
  });

  const [enviado, setEnviado] = useState(false);
  const [paroquiaInfo, setParoquiaInfo] = useState<ParoquiaModel | null>(null);
  const prevParoquiaSelecionada = useRef<ParoquiaModel | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (paroquiaSelecionada) 
      if (paroquiaSelecionada && paroquiaSelecionada !== prevParoquiaSelecionada.current) {
      api
        .get(`/api/paroquias-nome/${paroquiaSelecionada.NomeParoquia}`)
        .then((response) => {
          setParoquiaInfo(response.data);
          console.log('Valor de paroquiaInfo:', response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar informações da paróquia:", error);
        });
    }
  }, [paroquiaSelecionada]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Email) {
      console.error("O campo 'Email' é obrigatório.");
      return;
    }
  
    api
      .post("/feedback/add-feedback", formData)
      .then((response) => {
        setEnviado(true);
      })
      .catch((error) => {
        console.error("Erro ao enviar feedback:", error);
      });
  };
  

  return (
    
    <div className="entre-em-contato">
      <h2>Entre em Contato</h2>
      {window.innerWidth > 1024 && paroquiaInfo && ( 
      <p className="paragrafo-1024"> 
        Localização: {paroquiaInfo.LocalizacaoParoquia}, {paroquiaInfo.Bairro}, {paroquiaInfo.CEP}
      </p>
    )}
      <iframe 
      className="mapa"
        title="Mapa da Paróquia"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.56270434933!2d-44.03224172231609!3d-19.942824338218163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa695e5f8be9079%3A0x10da2c4429defb98!2sPar%C3%B3quia%20Santa%20Maria%20Rainha%20dos%20Ap%C3%B3stolos!5e0!3m2!1spt-PT!2sbr!4v1697628445097!5m2!1spt-PT!2sbr"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
        <div className="form">
          <form className="formulario" onSubmit={handleSubmit}>
            <div className="input-group">
              <input className="input-form"
                type="text"
                placeholder="Nome e sobrenome:"
                id="nome"
                name="NomeUsuario"
                value={formData.NomeUsuario}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <input className="input-form"
                type="Email"
                id="Email"
                name="Email"
                placeholder="Email:"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <textarea className="caixa-de-mensagem"
                id="mensagem"
                name="Mensagem"
                placeholder="Mensagem:"
                value={formData.Mensagem}
                onChange={handleChange}
              />
            </div>
            <button className="button-form" type="submit">Enviar</button>
            {enviado && <p>Feedback enviado com sucesso!</p>}
          </form>
          {paroquiaInfo && (
        <div className="paroquia-Informacoes">
          <p>
              {" "}
              {paroquiaInfo.InformacoesAdicionais}
            </p>
            <p>{paroquiaInfo.NomeParoquia}</p>
            <p>Localização: {paroquiaInfo.LocalizacaoParoquia}, {paroquiaInfo.Bairro}, {paroquiaInfo.CEP}</p>
            <p>Padres: {paroquiaInfo.Padres}</p>
            <p>Contatos: {paroquiaInfo.EmailResponsavel}</p>
          </div>
        )}
        </div>
      </div>
   
  );
};

export default EntreEmContato;