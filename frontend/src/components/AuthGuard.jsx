import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { sessionDataAtom } from "../store/atoms/authAtom";

function AuthGuard({ children }) {
  const navigate = useNavigate();
  let location = useLocation();
  const sessionData = useRecoilValue(sessionDataAtom);

  useEffect(() => {
    if (location.pathname !== "/" && !sessionData) navigate("/");
    if (sessionData) navigate("/tale");
  }, []);

  return children;
}

export default AuthGuard;
