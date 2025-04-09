import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { execSync } from "child_process";

// This function is used to get a free port for the server
function getFreePort() {
  // Get a list of ports that are currently in use
  const ports = [5173, 5176, 5174];
  // Loop through the ports and check if they are in use
  for (const port of ports) {
    try {
      // Try to connect to the port
      // If it is in use, the connection will be refused
      // If it is not in use, the connection will be successful
      execSync(`lsof -i:${port}`);
    } catch {
      // If the connection fails, the port is free
      // Return the port number
      return port;
    }
  }
  // If all the ports are in use, return the first port in the list
  return 5173;
}

// https://vite.dev/config/
export default defineConfig({
  // Set the root directory for the project
  plugins: [react()],
  // Set the server configuration
  server: {
    // Set the port for the server
    port: getFreePort(),
    // Set the host for the server
    open: true,
    host: "0.0.0.0",
  },
});
