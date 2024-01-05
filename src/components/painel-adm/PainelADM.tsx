// PainelAdm.jsx
import { useEffect, useState } from 'react';
import PermissaoComponent from './PermissaoComponent';
import EditarPerfilUsuario from './EdicaoPerfilUsuario';
import CriarEventos from './CriarEventos';
import EditarEvento from './EditarEventos';
import AdministrarUsuarios from './AdministrarUsuarios'
import HeaderADM from './headerADM';
import AdministrarParoquia from './AdministrarParoquia';
import api from '../../apiConfig';
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
        const authToken = sessionStorage.getItem('token');
        

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
       <HeaderADM nomeParoquia={NomeParoquia} />
       <PermissaoComponent requiredAccessLevel={5} userAccess={userAccess}>
        <AdministrarUsuarios servicosComunitarios={servicosComunitarios} />
      </PermissaoComponent>
      <PermissaoComponent requiredAccessLevel={5} userAccess={userAccess}>
        <AdministrarParoquia />
      </PermissaoComponent>
      <PermissaoComponent requiredAccessLevel={5} userAccess={userAccess}>
        <EditarPerfilUsuario />
      </PermissaoComponent>
      <PermissaoComponent requiredAccessLevel={4} userAccess={userAccess}>
        <CriarEventos userAccess={userAccess} servicosComunitarios={servicosComunitarios} />
      </PermissaoComponent>
      <PermissaoComponent requiredAccessLevel={4} userAccess={userAccess}>
  <EditarEvento userAccess={userAccess} servicosComunitarios={servicosComunitarios} />
</PermissaoComponent>
    </div>
  );
}

export default PainelAdm;