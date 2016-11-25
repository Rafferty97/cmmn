import 'babel-polyfill/dist/polyfill.min.js';

import { createElement, mount } from 'cmmn';
import router from 'cmmn-router';

const page = router(window.__PROPS__);

mount(document.body, page.children[1], window.__MOUNT__DATA__);
