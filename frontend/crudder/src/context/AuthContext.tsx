import  React, {
  createContext,
  useContext,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userAuth: any;
  loading: boolean
  setLoading:React.Dispatch<React.SetStateAction<boolean>>,
  setUserAuth: React.Dispatch<React.SetStateAction<any>>
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error finding AuthContext");
  }
  return context;
};

export {useAuth , AuthContext}
