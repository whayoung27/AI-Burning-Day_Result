import express from "express";
import routes from "../routes";
import {
  uploadScript,
  scorePractice,
  scorePresentation,
  scriptHome,
  getScriptList,
  scriptDetail,
  analysis,
  wrongSentence
} from "../controllers/scriptController";
import multer from "multer";

var upload = multer({ dest: "./blobUploads/" });

const scriptRouter = express.Router();

scriptRouter.post(routes.home, scriptHome);
scriptRouter.get(routes.analysis, analysis);
scriptRouter.get(routes.wrongSentence, wrongSentence);
scriptRouter.post(routes.uploadScript, uploadScript); //post 로 수정 요망
scriptRouter.post(
  routes.scorePractice,
  upload.single("blobFile"),
  scorePractice
);
scriptRouter.get(routes.scorePresentation, scorePresentation);
scriptRouter.get(routes.getScriptList, getScriptList);
scriptRouter.get(routes.scriptDetail(), scriptDetail);
scriptRouter.get(routes.scriptAnalysis(), analysis);

export default scriptRouter;
