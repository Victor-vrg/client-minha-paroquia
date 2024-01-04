import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RecuperacaoSenha() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarFormToken, setMostrarFormToken] = useState(false);
  const [emailError, setEmailError] = useState('');
const [tokenError, setTokenError] = useState('');
const [senhaError, setSenhaError] = useState('');
  const navigate = useNavigate();
  const api = axios.create({
     baseURL: 'http://localhost:3001/',
  });
  const handleEnviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/tokens/enviar-email-recuperacao', { email });
      console.log(response.data);
  
      setMostrarFormToken(true);
    } catch (error) {
      console.error('Erro ao enviar o email de recuperação:', error);
      setEmailError('Email não encontrado. Verifique se o email informado está correto.');
    }
  }
  
  const handleConfirmarToken = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (novaSenha !== confirmarSenha) {
      setSenhaError('As senhas não coincidem.');
      return;
    }
  
    try {
      const response = await api.post('/tokens/verificar-token-recuperacao', { token, novaSenha });
      console.log(response.data);
  
      navigate('/pagina-principal-paroquia');
    } catch (error) {
      console.error('Erro ao verificar o token de recuperação:', error);
      setTokenError('Token inválido ou expirado. Verifique se o token está correto ou solicite um novo.');
    }
  }

  return (
    <div className='recuperacao-senha'>
      <div className="recuperacao-central">
        <div className="recuperacao-container">
          <div className="login-form">
            <h2>Recuperação de Senha</h2>
            {!mostrarFormToken ? (
              <form id="form-recuperar-senha" onSubmit={handleEnviarEmail}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="error-message">{emailError}</span>
                <button type="submit">Enviar</button>
              </form>
            ) : (
              <div id="div-confirmar-token">
                <form id="form-confirmar-token" onSubmit={handleConfirmarToken}>
                  <label htmlFor="token">Token de Confirmação:</label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    placeholder="Digite o token de confirmação"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                  <span className="error-message">{tokenError}</span>
                  <label htmlFor="nova-senha">Nova Senha:</label>
                  <div className="password-input">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      id="nova-senha"
                      name="nova-senha"
                      placeholder="Digite sua nova senha"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
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
                    />
                    <FontAwesomeIcon
                      icon={mostrarSenha ? faEye : faEyeSlash}
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="eye-icon right-icon" 
                    />
                    <span className="error-message">{senhaError}</span>
                  </div>
                  <button type="submit">Confirmar</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperacaoSenha;
