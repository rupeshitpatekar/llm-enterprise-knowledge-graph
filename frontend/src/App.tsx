import type { FC } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateWrapper from "./routes/PrivateWrapper";

import { ptTokenValidityCheck } from "./util";
import { HomePage, LandingPage } from "./components";

interface AppProps {}

const App: FC<AppProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    ptTokenValidityCheck()
  );

  return (
    <Routes>
      <Route element={<PrivateWrapper isAuth={isAuthenticated} />}>
        <Route
          path="*"
          element={<HomePage setIsAuthenticated={setIsAuthenticated} />}
        />
      </Route>
      <Route
        path="/"
        Component={() =>
          isAuthenticated ? (
            <HomePage setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <LandingPage setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
    </Routes>
  );
};

export default App;
