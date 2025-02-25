/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import pluginId from "../../pluginId";
import HomePage from "../HomePage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path={`/plugins/${pluginId}`} element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;

