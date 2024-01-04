import React, { MouseEvent, useState, useEffect} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import "@fontsource/roboto/400.css";
import '../styles/header.css';
import { useNavigate } from "react-router-dom";


interface HeaderProps {
  nomeParoquia: string;
  isFielDesconhecido: boolean;
}

const Header: React.FC<HeaderProps> = ({ nomeParoquia, isFielDesconhecido }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const authToken = sessionStorage.getItem('token');
  const navigate = useNavigate();

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditProfile = () => {
    if (!sessionStorage.getItem('token')) {
      navigate('/login');
    } else {
      navigate('/painel-adm', { state: { authToken } });
    }
  };

  const handleRegister = () => {
    navigate('/cadastro');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleResize = () => {
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="header">
      <AppBar className="header-bar">
        <Toolbar className="toolbar">
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            color="inherit"
            aria-label="menu de navegação"
            className="botão-de-navegação"
          >
            <MenuIcon />
          </IconButton>
          <Typography className="nome-paroquia" variant="h6">
            {nomeParoquia}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            edge="end"
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
            {isFielDesconhecido ? (
              <MenuItem onClick={handleRegister}>Fazer Cadastro</MenuItem>
            ) : (
              <MenuItem onClick={handleEditProfile}>Editar Perfil</MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Sair</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <List>
          <ListItem button onClick={() => scrollToSection("eventos")}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("excursao")}>
            <ListItemIcon>
              <FlightTakeoffIcon />
            </ListItemIcon>
            <ListItemText primary="Excursões" />
          </ListItem>
          <ListItem button onClick={() => scrollToSection("entre-em-contato")}>
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary="Entre em Contato" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Header;
