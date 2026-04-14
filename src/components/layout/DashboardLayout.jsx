import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box className="page-shell" sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
        slotProps={{ paper: { sx: { width: 260, backgroundColor: "transparent" } } }}
      >
        <Sidebar mobile onClose={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: "auto" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;