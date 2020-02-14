//Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// 태진
// /script/upload

// 종민
// /file/upload
// /file/download

// 희영
// /script/scorePractice
// /sciprt/scorePresentation

//Script
const SCRIPTS = "/script";
const SCRIPT_DETAIL = "/:id";
const FILES = "/file";
const SCORE_PRACTICE = "/score-practice";
const SCORE_PRESENTATION = "/score-presentation";
const UPLOAD_SCRIPT = "/upload";
const UPLOAD_FILE = "/upload";
const DOWNLOAD_FILE = "/download";
const GET_SCRIPT_LIST = "/get-list";
const ANALYSIS = "/analysis";
const ANALYSIS_ID = "/analysis/:id";
const WRONGSENTENCE = "/wrongSentence";

//File

const routes = {
  home: HOME,
  script: SCRIPTS,
  file: FILES,
  scorePractice: SCORE_PRACTICE,
  analysis:ANALYSIS,
  wrongSentence: WRONGSENTENCE,
  scorePresentation: SCORE_PRESENTATION,
  uploadScript: UPLOAD_SCRIPT,
  uploadFile: UPLOAD_FILE,
  downloadFile: DOWNLOAD_FILE,
  getScriptList: GET_SCRIPT_LIST,
  scriptDetail: id => {
    if (id) {
      return `/script/${id}`;
    } else {
      console.log("WARNING: id required");
      return SCRIPT_DETAIL;
    }
  },
  scriptAnalysis: id => {
    if (id) {
      return `/script/analysis/${id}`;
    } else {
      console.log("WARNING: id required");
      return ANALYSIS_ID;
    }
  }
};

export default routes;
