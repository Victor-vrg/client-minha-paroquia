import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { ObjectId } from "mongodb";
import "../../styles/AdmUser.css";

interface Usuario {
  _id: ObjectId;
  NomeCompleto: string;
  Email: string;
  Telefone?: string | null;
  Bairro?: string | null;
  DataNascimento?: string | null;
  ParoquiaMaisFrequentada?: any;
  IDServicoComunitario?: ServicoComunitarioModel[];
}

interface ServicoComunitarioModel {
  _id: ObjectId;
  UsuarioID: string;
  nomeServicoComunitario: string;
  NivelAcessoNoServico: number;
  justificativa: string;
}

interface AdministrarUsuariosProps {
  servicosComunitarios: ServicoComunitarioModel[];
}

const api = axios.create({
  baseURL: "http://localhost:3001/",
});
const authToken = sessionStorage.getItem("token");

const AdministrarUsuarios: React.FC<AdministrarUsuariosProps> = ({
  servicosComunitarios,
}) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [servicosDoUsuario, setServicosDoUsuario] = useState<
    ServicoComunitarioModel[]
  >([]);
  const [servicoEditado, setServicoEditado] =
    useState<ServicoComunitarioModel | null>(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [servicosEditados, setServicosEditados] = useState<{
    [key: string]: ServicoComunitarioModel;
  }>({});
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/usuarios/getUsers", {
          headers: {
            Authorization: authToken,
          },
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsuarios();
  }, []);
  // Novos estados para o modal de resumo de alterações
  const [resumoModalIsOpen, setResumoModalIsOpen] = useState(false);
  const [alteracoesPendentes, setAlteracoesPendentes] = useState<
    ServicoComunitarioModel[]
  >([]);

  const openModal = async (usuario: Usuario) => {
    try {
      const response = await api.get(
        `/role/getServicosComunitarios/${usuario._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const servicosDoUsuario = response.data;
      setSelectedUsuario({
        ...usuario,
        IDServicoComunitario: servicosDoUsuario,
      });
      setServicosDoUsuario(servicosDoUsuario);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Erro ao buscar serviços comunitários do usuário:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePromoverRebaixar = (novoNivel: string) => {
    // Implemente a lógica para promover/rebaixar o usuário no backend
    // Atualize o estado local, se necessário
    closeModal();
  };

  const nivelAcessoLabels: { [key: number]: string } = {
    2: "Administrador Paroquial",
    3: "Coordenador",
    4: "Líder",
    5: "Fiel Usuário",
  };

  const obterLabelNivelAcesso = (nivel: number): string => {
    return nivelAcessoLabels[nivel] || "Desconhecido";
  };

  const openEditModal = (servico: ServicoComunitarioModel) => {
    setServicoEditado({ ...servico });
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setServicoEditado(null);
  };

  const handleEditarServico = (servicoEditado: ServicoComunitarioModel) => {
    setServicosEditados((prev) => ({
      ...prev,
      [servicoEditado._id.toString()]: servicoEditado,
    }));
    closeEditModal();
  };

  const handleSalvarAlteracoes = async () => {
    try {
      const changes = Object.values(servicosEditados);
      setAlteracoesPendentes(changes);
      setResumoModalIsOpen(true);
      setServicosEditados({});
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const handleEfetivarMudancas = async () => {
    try {
      const changes = Object.values(servicosEditados);
      await Promise.all(
        changes.map((change) =>
          api.put(
            `/role/editServicoComunitario/${change._id}`,
            {
              NivelAcessoNoServico: change.NivelAcessoNoServico,
              // Outros campos a serem atualizados
            },
            {
              headers: {
                Authorization: authToken,
              },
            }
          )
        )
      );

      setResumoModalIsOpen(false);
    } catch (error) {
      console.error("Erro ao efetivar mudanças:", error);
    }
  };

  const closeResumoModal = () => {
    setResumoModalIsOpen(false);
  };

  return (
    <div className="admWrapper">
      <div className="admContainer">
        <div className="admconteudo">
          <h2 className="tituloForm">Administração de Usuários</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id.toString()}>
                  <td>{usuario.NomeCompleto}</td>
                  <td>{usuario.Email}</td>
                  <td>
                    <button onClick={() => openModal(usuario)}>
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          className="modal-detalhes-user"
          open={modalIsOpen}
          onClose={closeModal}
          aria-labelledby="Detalhes do Usuário"
          aria-describedby="Detalhes do Usuário"
        >
          <div>
            {selectedUsuario && (
              <div className="detalhe-container">
                <div className="detalhes-users">
                  <div className="detalhes-user">
                    <div className="header-detalhe">
                      <h2 id="t2">Detalhes do Usuário</h2>
                      <CancelIcon color="primary" onClick={closeModal} />
                    </div>

                    <p>Nome: {selectedUsuario.NomeCompleto}</p>
                    <p>Email: {selectedUsuario.Email}</p>
                    <p>Bairro: {selectedUsuario.Bairro}</p>
                    <p>Data de Nascimento: {selectedUsuario.DataNascimento}</p>
                    <p>Telefone: {selectedUsuario.Telefone}</p>
                  </div>
                  <div className="detalhes-serv-comunitario">
                    <h2>Serviços Comunitários</h2>
                    <div className="tabela-serv-comunitario">
                      <table>
                        <thead>
                          <tr>
                            <th>Servico Comunitário</th>
                            <th>Nível de Acesso</th>
                            <th>Edição</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicosDoUsuario.map((servico) => (
                            <tr key={servico._id.toString()}>
                              <td>{servico.nomeServicoComunitario}</td>
                              <td>
                                {obterLabelNivelAcesso(
                                  servico.NivelAcessoNoServico
                                )}
                              </td>
                              <td>
                                <button onClick={() => openEditModal(servico)}>
                                  <EditIcon fontSize="inherit" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    className="sub-botao"
                    onClick={handleSalvarAlteracoes}
                  >
                    Salvar Alterações
                  </button>
                  <button className="sub-botao" onClick={closeModal}>
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          open={editModalIsOpen}
          onClose={closeEditModal}
          aria-labelledby="Editar Serviço Comunitário"
          aria-describedby="Editar Serviço Comunitário"
        >
          <div className="editar-servico">
            {servicoEditado && (
              <div className="editar-servicos">
                <h2>Editar Serviço Comunitário</h2>
                <div className="container-servicos">
                  <label>Nome: {servicoEditado.nomeServicoComunitario}</label>
                  <label>
                    Nome do usuário: {selectedUsuario?.NomeCompleto}
                  </label>
                  <label>Nível de Acesso:</label>
                  <select
                    className="niveldeacesso"
                    value={servicoEditado.NivelAcessoNoServico}
                    onChange={(e) =>
                      setServicoEditado({
                        ...servicoEditado,
                        NivelAcessoNoServico: parseInt(e.target.value),
                      })
                    }
                  >
                    {Object.keys(nivelAcessoLabels).map((nivel) => (
                      <option key={nivel} value={nivel}>
                        {nivelAcessoLabels[parseInt(nivel)]}
                      </option>
                    ))}
                  </select>
                  <label>Justificativa:</label>
                  <input
                    type="text"
                    placeholder="Porque da mudança?"
                    value={servicoEditado.justificativa || ""}
                    onChange={(e) =>
                      setServicoEditado({
                        ...servicoEditado,
                        justificativa: e.target.value,
                      })
                    }
                  />

                  <button onClick={() => handleEditarServico(servicoEditado)}>
                    Salvar
                  </button>
                  <button onClick={closeEditModal}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </Modal>

        <Modal
          open={resumoModalIsOpen}
          onClose={closeResumoModal}
          aria-labelledby="Resumo de Alterações"
          aria-describedby="Resumo de Alterações"
        >
          <div className="resumo-modal">
            <div className="editar-servicos">
              <h2>Resumo de Alterações</h2>
              <ul>
                {alteracoesPendentes.map((change) => (
                  <li key={change._id.toString()}>
                    {`Nome do Usuário: ${selectedUsuario?.NomeCompleto},Serviço: ${change.nomeServicoComunitario}, Nível de Acesso: ${change.NivelAcessoNoServico}, Justificativa: ${change.justificativa}`}
                  </li>
                ))}
              </ul>
              <button className="sub-botao" onClick={handleEfetivarMudancas}>
                Efetivar mudanças
              </button>
              <button className="sub-botao" onClick={closeResumoModal}>
                Voltar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdministrarUsuarios;
