import React from 'react';

interface PermissaoComponentProps {
  requiredAccessLevel: number;
  userAccess: { NivelAcessoNoServico: number }[];
  children: React.ReactNode;
}

const PermissaoComponent: React.FC<PermissaoComponentProps> = ({ requiredAccessLevel, userAccess, children }) => {
  const hasPermission = userAccess.some((servico) => servico.NivelAcessoNoServico < requiredAccessLevel);

  return <>{hasPermission ? children : null}</>;
};

export default PermissaoComponent;