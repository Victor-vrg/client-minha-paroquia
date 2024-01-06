import React, { MouseEvent, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "@fontsource/roboto/400.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  nomeParoquia: string;
}

const HeaderADM: React.FC<HeaderProps> = ({ nomeParoquia }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const voltarPaginaPrincipal = () => {
    navigate("/pagina-principal-paroquia");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="header">
      <AppBar className="header-bar">
        <Toolbar className="toolbar">
          <Typography className="nome-paroquia-2"  variant="h6">
      Painel Administrativo
          </Typography>
          <div className="spacer" />
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            aria-label="menu do usuário"
            className="botão-de-perfil"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={voltarPaginaPrincipal}>Voltar Página Principal</MenuItem>
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HeaderADM;
