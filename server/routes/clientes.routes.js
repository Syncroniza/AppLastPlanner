import {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
  } from "../controller/cliente.controller.js";
  
  const clienteRoutes = (app) => {
    app.get("/clientes/", getAllClientes);
    app.get("/clientes/:id/", getClienteById);
    app.post("/clientes/", createCliente);
    app.patch("/clientes/:id/", updateCliente);
    app.delete("/clientes/:id/", deleteCliente);
  };
  
  export default clienteRoutes;
  