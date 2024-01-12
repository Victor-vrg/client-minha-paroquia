import React, { useEffect, useState, lazy, Suspense } from 'react';
import PermissaoComponent from './PermissaoComponent';
import api from '../../apiConfig';
import HeaderADM from './headerADM';

const authToken = sessionStorage.getItem('token');


const AdministrarUsuarios = lazy(() => import('./AdministrarUsuarios'));
const AdministrarParoquia = lazy(() => import('./AdministrarParoquia'));
const EditarPerfilUsuario = lazy(() => import('./EdicaoPerfilUsuario'));
const CriarEventos = lazy(() => import('./CriarEventos'));
const CriarExcursao = lazy(() => import('./CriarExcursao'));
const EditarEvento = lazy(() => import('./EditarEventos'));
interface PainelAdmProps {
  userAccess: { NivelAcessoNoServico: number }[];
  NomeParoquia: string;  
}
function PainelAdm({ userAccess, NomeParoquia }: PainelAdmProps) {
  const [carregando, setCarregando] = useState(true);
  const [servicosComunitarios, setServicosComunitarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicosComunitariosResponse = await api.get('/role/niveis-abaixode5', {
          headers: {
            Authorization: authToken,
          },
        });

          setServicosComunitarios(servicosComunitariosResponse.data);
          setCarregando(false);
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchData();
  }, []);

  if (carregando) {
    return <div>Carregando...</div>;
  }
  const painelAdmStyle = {
    backgroundColor: 'gray',
   
  };

  return (
    <div style={painelAdmStyle}>
      <Suspense fallback={<div>Carregando...</div>}>
        <HeaderADM nomeParoquia={NomeParoquia} />
        <PermissaoComponent requiredAccessLevel={3} userAccess={userAccess}>
          <AdministrarUsuarios servicosComunitarios={servicosComunitarios} />
        </PermissaoComponent>
        <PermissaoComponent requiredAccessLevel={3} userAccess={userAccess}>
          <AdministrarParoquia />
        </PermissaoComponent>
        <PermissaoComponent requiredAccessLevel={6} userAccess={userAccess}>
          <EditarPerfilUsuario />
        </PermissaoComponent>
        <PermissaoComponent requiredAccessLevel={4} userAccess={userAccess}>
          <CriarEventos userAccess={userAccess} servicosComunitarios={servicosComunitarios} />
        </PermissaoComponent>
        <PermissaoComponent requiredAccessLevel={5} userAccess={userAccess}>
          <CriarExcursao userAccess={userAccess} servicosComunitarios={servicosComunitarios} />
        </PermissaoComponent>
        <PermissaoComponent requiredAccessLevel={4} userAccess={userAccess}>
          <EditarEvento userAccess={userAccess} servicosComunitarios={servicosComunitarios} />
        </PermissaoComponent>
      </Suspense>
    </div>
  );
};

export default PainelAdm;