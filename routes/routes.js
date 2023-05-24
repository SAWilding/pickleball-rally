const routes = require("express").Router();

const MyController = require("../controllers/rallies");

routes.post("/", MyController.createRally);
routes.get("/", MyController.readRallys);
routes.put("/:id", MyController.updateRally);
routes.delete("/:id", MyController.deleteRally);

module.exports = routes;
