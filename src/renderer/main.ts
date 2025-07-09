import { createApp } from "vue";
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Import des icônes spécifiques
import {
  faFolder,
  faFile,
  faSync,
  faChevronRight,
  faChevronDown,
  faFilePdf,
  faFileZipper,
  faFileVideo,
  faFileAudio,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileLines,
  faHardDrive,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faFolder,
  faFile,
  faSync,
  faChevronRight,
  faChevronDown,
  faFilePdf,
  faFileZipper,
  faFileVideo,
  faFileAudio,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileLines,
  faHardDrive,
  faRotateRight
);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
