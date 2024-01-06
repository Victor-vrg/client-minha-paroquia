import React, { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../apiConfig';
interface PrivateRouteProps {
  children: (
    data: {
      userAccess: any[];
      servicosComunitarios: any[];
    }
  ) => ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authToken = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [userAccess, setUserAccess] = useState<any[]>([]);
  

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const userAccessResponse = await api.get('/role/niveis-de-acesso', {
          headers: {
            Authorization: authToken,
          },
        });

        if (isMounted) {
          setUserAccess(userAccessResponse.data);
        }
      } catch (error) {
        console.error('Erro ao obter dados:', error);
        navigate('/pagina-principal-paroquia');
      }
    };

    if (!authToken || authToken === 'fiel-desconhecido') {
      navigate('/pagina-principal-paroquia');
    } else {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, navigate]);

  return <>{children({ userAccess, servicosComunitarios: [] })}</>;
};

export default PrivateRoute;