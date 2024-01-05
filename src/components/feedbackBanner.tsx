import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../styles/FeedbackBanner.css';
import api from "../apiConfig";


const FeedbackBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [formData, setFormData] = useState({
    NomeUsuario: '',
    Email: '',
    Mensagem: '',
  });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowBanner(true);
    }, 10000); // Tempo em milissegundos (10 segundos)

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const closeBanner = () => {
    setShowBanner(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  

    if (!formData.NomeUsuario || !formData.Email || !formData.Mensagem) {
        console.log('Preencha todos os campos');
      return;
    }
  
    // Enviar os dados do formulário para o servidor
    api
      .post('/feedback/add-feedback', formData)
      .then((response) => {
        console.log('Feedback enviado com sucesso'); 
        setEnviado(true);
        
      })
      .catch((error) => {
        console.error('Erro ao enviar feedback:', error);
        
      });
  };

  return (
    <div className={`feedback-banner ${showBanner ? 'visible' : ''}`}>
        <div className='feedback-wrapper'>
      <div className="feedback-content">
        <span className="close-button" onClick={closeBanner}>
          X
        </span>
        <h3>Preciso da sua opinião sobre o site!</h3>
        <p>
          Meu nome é Victor Resende e estou trabalhando em um projeto integrador para ajudar a comunidade. Gostaria de ouvir sua opinião e como o projeto lhe impactou.
        </p>
        <p>Preciso de sua contribuição com seu depoimento para meu projeto de conclusão da minha graduação</p>
        <div className="form-feedback">
          <form className="formulario-feedback" onSubmit={handleSubmit}>
          <div className="input-inline">
                <input
                  className="input-form"
                  type="text"
                  placeholder="Nome e sobrenome:"
                  id="nome"
                  name="NomeUsuario"
                  value={formData.NomeUsuario}
                  onChange={handleChange}
                />
                <input
                  className="input-form"
                  type="email"
                  id="email"
                  name="Email"
                  placeholder="E-mail:"
                  value={formData.Email}
                  onChange={handleChange}
                />
              </div>
              <div className="mensage-feedback">
                <textarea
                  className="caixa-de-mensagem"
                  id="mensagem"
                  name="Mensagem"
                  placeholder="Mensagem:"
                  value={formData.Mensagem}
                  onChange={handleChange}
                />
              </div>
            <button className="button-form1" type="submit">
              Enviar
            </button>
            {enviado && <p>Feedback enviado com sucesso!</p>}
          </form>
        </div>
      </div>
    </div>
</div>
  );
};

export default FeedbackBanner;
