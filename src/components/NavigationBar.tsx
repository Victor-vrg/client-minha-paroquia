import React from 'react';
import { Paper, Button, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ContactSupportIcon from '@mui/icons-material/ContactSupport'; // Adicione o ícone de suporte de contato

interface NavigationBarProps {
  onEventosClick: () => void;
  onExcursaoClick: () => void;
  onContatoClick: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  onEventosClick,
  onExcursaoClick,
  onContatoClick,
}) => {
  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '80px',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 1000,
        '@media (min-width: 601px)': {
          display: 'none', 
        },
      }}
    >
      <Stack direction="column" alignItems="center">
        <Button
          startIcon={<EventIcon />}
          size="small"
          sx={{ flexDirection: 'column', gap: '12px' }} 
          onClick={onEventosClick} 
        >
          Eventos
        </Button>
      </Stack>
      <Stack direction="column" alignItems="center">
        <Button
          startIcon={<FlightTakeoffIcon />}
          size="small"
          sx={{ flexDirection: 'column', gap: '12px' }} 
          onClick={onExcursaoClick} 
        >
          Excursões
        </Button>
      </Stack>
      <Stack direction="column" alignItems="center">
        <Button
          startIcon={<ContactSupportIcon />}
          size="small"
          sx={{ flexDirection: 'column', gap: '12px' }} 
          onClick={onContatoClick} 
        >
          Contato
        </Button>
      </Stack>
    </Paper>
  );
};

export default NavigationBar;
