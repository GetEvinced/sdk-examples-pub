// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import * as React from "react";
import { act } from "react-dom/test-utils";
import { configure } from "@evinced/unit-tester";

configure({
  serviceAccountId: process.env.EVINCED_SERVICE_ID,
  serviceAccountSecret: process.env.EVINCED_API_KEY,
});

// configure({
//   serviceAccountId: "",
//   offlineToken: ""
// });

/* eslint-disable no-undef */
globalThis.act = React.act || act;
/* eslint-enable no-undef */
