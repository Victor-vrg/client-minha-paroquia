import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';
import Carrossel from '../components/Carrossel';  
import CarrosselExcursao from '../components/CarrosselExcursao';  
import EntreEmContato from '../components/Entreemcontato';
import FeedbackBanner from '../components/feedbackBanner';

import NavigationBar from './NavigationBar'; 
import api from "../apiConfig";
import { ObjectId } from 'mongodb';

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

interface EventosModel {
  _id: ObjectId | any ; 
  NomeEvento: string;
  DataInicio: Date | string;
  DataFim: Date | string;
  HoraInicio: string ;
  HoraFim: string;
  LocalizacaoEvento: string;
  DescricaoEvento: string;
  CaminhoImagem: string;
  TipoEvento: string;
  Destaque: boolean ;
  Ocultar:   boolean | Number;
  ParoquiaID: string | ObjectId;
  IDServicoComunitario?: string[]; 
}
interface ExcursaoModel {
  _id: ObjectId;
  NomeExcursao: string;
  DataInicioExcursao: Date;
  DataFimExcursao: Date;
  HoraInicioExcursao: string;
  HoraFimExcursao: string;
  LocalizacaoExcursao: string;
  DescricaoExcursao: string;
  CaminhoImagem: string;
  PrecoExcursao: number;
  VagasExcursao: number;
  ParoquiaID:  ObjectId | null;
  Ocultar: number;
  Destaque: number;
}
interface PaginaPrincipalParoquiaProps {
  paroquiaSelecionada: ParoquiaModel | null;
  isFielDesconhecido: boolean;
}



const PaginaPrincipalParoquia: React.FC<PaginaPrincipalParoquiaProps> = ({ paroquiaSelecionada}) => {
  const [eventos, setEventos] = useState<EventosModel[]>([]);
  const [excursao, setExcursao] = useState<ExcursaoModel[]>([]);
  const location = useLocation();
const isFielDesconhecido = location.state?.isFielDesconhecido || false;

  const nomeParoquia = location.state?.nomeParoquia || sessionStorage.getItem('paroquiaSelecionada') || '';

  useEffect(() => {
    api.get(`/eventos/eventos`)
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos:', error);
      });

    api.get(`/excursao/excursao`)
      .then((response) => {
        setExcursao(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar excursões:', error);
      });
  }, [nomeParoquia]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
     <FeedbackBanner /> 
      <Header nomeParoquia={nomeParoquia} isFielDesconhecido={isFielDesconhecido} />
      <div id="eventos">
        <Carrossel titulo="Eventos" eventos={eventos} />
      </div>
      <div id="excursao">
        <CarrosselExcursao titulo="Excursões" excursao={excursao} />
      </div>
      <div id="entre-em-contato">
        <EntreEmContato paroquiaSelecionada={paroquiaSelecionada} />
      </div>
      <NavigationBar
        onEventosClick={() => scrollToSection("eventos")}
        onExcursaoClick={() => scrollToSection("excursao")}
        onContatoClick={() => scrollToSection("entre-em-contato")}
      />
      <Footer />
    </div>
  );
};

export default PaginaPrincipalParoquia;
