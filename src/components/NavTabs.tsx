import React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';

const tabRoutes = ['/', '/table1', '/table2', '/table3'];

export default function NavTabs() {
  const location = useLocation();
  const currentPath = location.pathname || '/';

  const currentIndex = Math.max(
    0,
    tabRoutes.indexOf(currentPath) === -1 ? 1 : tabRoutes.indexOf(currentPath)
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          AgGrid Demo
        </Typography>
        <Tabs value={currentIndex} textColor="inherit" indicatorColor="secondary">
          <Tab label="Home" component={Link} to="/" />
          <Tab label="Table 1" component={Link} to="/table1" />
          <Tab label="Table 2" component={Link} to="/table2" />
          <Tab label="Table 3" component={Link} to="/table3" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
