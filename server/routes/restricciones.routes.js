import {
    getAllRestriciones,
    getOneRestricciores,
    createRestricciones,
    deleteRestricciones,
    editRestricciones,
  } from "../controller/restricciones.controller.js";
  
  const restriccioesRoutes = (app) => {
    app.get("/restricciones/", getAllRestriciones);
    app.get("/restricciones/:id/", getOneRestricciores);
    app.post("/restricciones/", createRestricciones);
    app.delete("/restricciones/:id/", deleteRestricciones);
    app.patch("/restricciones/:id/", editRestricciones);
  };
  
  export default restriccioesRoutes;
  