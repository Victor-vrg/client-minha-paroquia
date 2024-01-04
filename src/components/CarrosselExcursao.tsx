import React, { useState } from 'react';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import '../styles/carrossel.css';
import { ObjectId } from 'mongodb';


SwiperCore.use([Navigation, Pagination]);

interface Excursao {
  _id: ObjectId;
  NomeExcursao: string;
  DataInicioExcursao: string| any;
  DataFimExcursao: string| any;
  HoraInicioExcursao: string;
  HoraFimExcursao: string;
  LocalizacaoExcursao: string;
  DescricaoExcursao: string;
  CaminhoImagem: string;
  PrecoExcursao: number;
  VagasExcursao: number;
  ParoquiaID: ObjectId | null;
  Destaque: number;
}

interface CarrosselExcursaoProps {
  titulo: string;
  excursao: Excursao[];
}

const CarrosselExcursao: React.FC<CarrosselExcursaoProps> = ({ titulo, excursao }) => {
  const [activeSlide, setActiveSlide] = useState<number | undefined>(undefined);

  return (
    <div className='carrossel-background'>
    <div className="carrossel-container">
      <h2 className="carrossel-titulo">{titulo}</h2>
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper: SwiperCore) => {
          setActiveSlide(swiper.activeIndex);
        }}
        breakpoints={{
          600: {
            slidesPerView: 2,
          },
          840: {
            slidesPerView: 3,
          },
        }}
      >
        {excursao.map((excursao, index) => (
          <SwiperSlide key={excursao._id.toString()}>
            <div
              className={`carrossel-item ${
                index === activeSlide ? 'active' : ''
              }`}
              onClick={() => {
                setActiveSlide(index === activeSlide ? undefined : index);
              }}
            >
              <img
                src={excursao.CaminhoImagem}
                alt={excursao.NomeExcursao}
                className="carrossel-imagem"
              />
              <div
                className={`carrossel-info ${
                  index === activeSlide ? 'expanded' : ''
                }`}
              >
                <h3>{excursao.NomeExcursao}</h3>
                <p>
                  <strong>Data:</strong> {formatarData(excursao.DataInicioExcursao, excursao.DataFimExcursao)}
                </p>
                <p>
                  <strong>Horário:</strong> {formatarHora(excursao.HoraInicioExcursao)} até {formatarHora(excursao.HoraFimExcursao)}
                </p>
                <p>
                  <strong>Localização:</strong> {excursao.LocalizacaoExcursao}
                </p>
                {index !== activeSlide && (
                  <p className="mais-informacoes">Para mais informações, clique aqui</p>
                )}
                {index === activeSlide && (
                  <div className="carrossel-descricao">
                    <p>
                      <strong>Detalhes:</strong> {excursao.DescricaoExcursao}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
  );
};

function formatarData(dataInicio: string, dataFim: string) {
    const dataInicioObj = new Date(dataInicio);
    const dataFimObj = new Date(dataFim);
  
    if (dataInicioObj.toDateString() === dataFimObj.toDateString()) {
      // Mesma data de início e fim
      return `${formatarDiaSemana(dataInicioObj)}, ${formatarDataCompleta(dataInicioObj)}`;
    } else {
      // Diferentes datas de início e fim
      return `${formatarDiaSemana(dataInicioObj)}, ${formatarDataCompleta(dataInicioObj)} - ${formatarDataCompleta(dataFimObj)}`;
    }
  }
  
  function formatarHora(hora: string) {
    const partes = hora.split(':');
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
  
    // Abreviação das horas
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horaAbreviada = horas > 12 ? horas - 12 : horas;
    const minutosFormatados = minutos.toString().padStart(2, '0');
  
    return `${horaAbreviada}:${minutosFormatados} ${periodo}`;
  }
  
  function formatarDiaSemana(data: Date) {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return diasSemana[data.getDay()];
  }
  
  function formatarDataCompleta(data: Date) {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
  }

export default CarrosselExcursao;
