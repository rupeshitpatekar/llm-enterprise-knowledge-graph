import { useState, type FC } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateWrapper from "./routes/PrivateWrapper";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import { ptTokenValidityCheck } from "./util";

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
