import express from "express";
import routes from "../routes";
import {
  uploadFile,
  donwloadFile,
  fileHome
} from "../controllers/fileController";

const fileRouter = express.Router();

fileRouter.get(routes.home, fileHome);
fileRouter.get(routes.uploadFile, uploadFile);
fileRouter.get(routes.downloadFile, donwloadFile);

export default fileRouter;
