import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Select, { ActionMeta, MultiValue } from 'react-select';
import '../../styles/cadastroUsuario.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../../apiConfig';





function EditarPerfilUsuario() {
  const [dados, setDados] = useState({
    NomeCompleto: '',
    Email: '',
    Telefone: '',
    ServicosComunitario: '',
    Bairro: '',
    ParoquiaMaisFrequentada: '',
    DataNascimento: '',
    IDServicoComunitario: [] as any[],
  });

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [servicosComunitariosOptions, setServicosComunitariosOptions] = useState<any[]>([]);
  const [selectedServicosComunitarios, setSelectedServicosComunitarios] = useState<MultiValue<any>>([]);
  const [paroquiaOptions, setParoquiaOptions] = useState<{ value: number; label: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleParoquiaInputChange = (inputValue: string) => {
    // Atualizar as opções de paróquias com base no texto de entrada
    if (inputValue.trim() === '') {
      setParoquiaOptions([]);
    } else {
      fetchParoquias(inputValue);
    }
  };

  const fetchServicosComunitarios = async () => {
    try {
      const response = await api.get('/usuarios/servicos-comunitarios');
      const options = response.data.map((servicoComunitario: any) => ({
        value: servicoComunitario._id,
        label: servicoComunitario.nomeServicoComunitario,
      }));
      setServicosComunitariosOptions(options);
    } catch (error) {
      console.error('Erro ao buscar serviços comunitários:', error);
    }
  };

  const fetchParoquias = async (searchText: string) => {
    try {
      const response = await api.get(`/api/paroquias?s=${searchText}`);
      const options = response.data.map((paroquia: any) => ({
        value: paroquia._id,
        label: paroquia.NomeParoquia,
      }));
      setParoquiaOptions(options);
    } catch (error) {
      console.error('Erro ao buscar sugestões de paróquias:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/usuarios/usuario-logado', {
        headers: {
          Authorization: authToken, 
        },
      });
      const userData = response.data;
      setDados({
        NomeCompleto: userData.nomeCompleto,
        Email: userData.email,
        Telefone: userData.telefone,
        Bairro: userData.bairro,
        ParoquiaMaisFrequentada: userData.paroquiaMaisFrequentada,
        DataNascimento: userData.dataNascimento,
        ServicosComunitario: userData.ServicosComunitario,
        IDServicoComunitario: userData.idServicoComunitario,
      });
    } 
    catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };
  // falta implementar preechimento automatico da paroquia do usuario e de seus serviços-comunitarios que ja tem cadastr!!

  const location = useLocation();
  const { authToken } = location.state;
  console.log('Token enviado na requisição:', authToken);

  useEffect(() => {
    fetchUserData();
    fetchServicosComunitarios(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const today = new Date().toISOString().split("T")[0];
    if (dados.DataNascimento > today) {
      alert('A data de nascimento não pode ser no futuro.');
      return;
    }
  
    if (novaSenha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem');
      return;
    }
  
    try {
      const data = {
        NomeCompleto: dados.NomeCompleto,
        Email: dados.Email,
        Telefone: dados.Telefone,
        Bairro: dados.Bairro,
        ParoquiaMaisFrequentada: dados.ParoquiaMaisFrequentada,
        DataNascimento: dados.DataNascimento,
        IDServicoComunitario: selectedServicosComunitarios.map((option) => option.value),
        NovaSenha: '',
      };
  
      if (novaSenha) {
        data.NovaSenha = novaSenha;
      }
  
      const response = await api.put('/usuarios/editar-perfil', data, {
        headers: {
          Authorization: authToken, 
        },
      });
      console.log('Resposta do servidor:', response.data);
    } catch (error) {
      console.error('Erro ao editar perfil:', error);
    }
  };
  

  return (
    <div className="editar-perfil-user">
      <div className="cadastro-container">
        <div className="cadastro-central">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <h2>Editar Perfil de Usuário</h2>

            <label htmlFor="NomeCompleto">Nome Completo:</label>
            <input
              type="text"
              id="NomeCompleto"
              name="NomeCompleto"
              value={dados.NomeCompleto}
              onChange={handleChange}
              required
            />

            <label htmlFor="Email">E-mail:</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={dados.Email}
              onChange={handleChange}
              required
            />

            <label htmlFor="Telefone">Celular ou Telefone:</label>
            <input
              type="tel"
              id="Telefone"
              name="Telefone"
              value={dados.Telefone}
              onChange={handleChange}
              required
            />

            <label htmlFor="ParoquiaMaisFrequentada">Paróquia mais Frequentada:</label>
            <Select
              className="select-input"
              options={paroquiaOptions}
              onInputChange={handleParoquiaInputChange}
              value={paroquiaOptions.find((option) => option.label === dados.ParoquiaMaisFrequentada)}
              onChange={(selectedOption) => {
                setDados({ ...dados, ParoquiaMaisFrequentada: selectedOption ? selectedOption.label : '' });
              }}
              isSearchable
              placeholder="Digite o nome da paróquia"
            />

            <label htmlFor="Bairro">Bairro:</label>
            <input
              type="text"
              id="Bairro"
              name="Bairro"
              value={dados.Bairro}
              onChange={handleChange}
              required
            />

            <label htmlFor="ServicosComunitario">Serviços Comunitários:</label>
            <Select
              className="select-input"
              options={servicosComunitariosOptions}
              value={selectedServicosComunitarios}
              onChange={(newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
                if (actionMeta.action === 'select-option') {
                  setSelectedServicosComunitarios(newValue);
                } else if (actionMeta.action === 'remove-value') {
                  setSelectedServicosComunitarios(newValue);
                } else if (actionMeta.action === 'clear') {
                  setSelectedServicosComunitarios([]);
                }
              }}
              isMulti
              placeholder="Selecione ou digite para buscar serviços comunitários"
              />
  
              <label htmlFor="DataNascimento">Data de Nascimento:</label>
              <input
                type="date"
                id="DataNascimento"
                name="DataNascimento"
                value={dados.DataNascimento}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
  
              <label htmlFor="nova-senha">Nova Senha:</label>
              <div className="password-input">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  id="nova-senha"
                  name="nova-senha"
                  placeholder="Digite sua nova senha (opcional)"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={mostrarSenha ? faEye : faEyeSlash}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="eye-icon right-icon"
                />
              </div>
  
              <label htmlFor="confirmar-senha">Confirmar Senha:</label>
              <div className="password-input">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  id="confirmar-senha"
                  name="confirmar-senha"
                  placeholder="Confirme a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
                <FontAwesomeIcon
                  icon={mostrarSenha ? faEye : faEyeSlash}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="eye-icon right-icon"
                />
                <span className="error-message">{senhaError}</span>
              </div>
  
              <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfilUsuario;
