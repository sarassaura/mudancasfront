import { useContext, useEffect, useState, type JSX } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/user";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import CustomButton from "../../components/CustomButton";

export interface Admin {
    "_id": string,
    "email": string,
    "nome": string,
    "senha": string,
}

export interface Funcionario {
    "_id": string,
    "email": string,
    "equipe": {
        "_id": string,
        "nome": string,
    }
    "nome": string,
    "senha": string,
}

function Login(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user, setUser } = useContext(UserContext)!;
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/admins`)
        .then(response => response.json())
        .then(data => setAdmins(data));
    fetch(`${API_BASE_URL}/funcionarios`)
    .then(response => response.json())
    .then(data => setFuncionarios(data));

    if (user) {
      navigate("/");
    }
  }, [API_BASE_URL, navigate, user]);

  const validarUsuario = () => {
    const admin = admins.filter((admin) => admin.email == email && admin.senha == senha);
    const funcionario = funcionarios.filter(
        (funcionario) => funcionario.email == email && funcionario.senha == senha
    );

    if (admin.length == 0 && funcionario.length == 0) {
        showError("Ops! Não conseguimos encontrar uma conta com esse usuário ou senha. Tente novamente.");
        setEmail('');
        setSenha('');
    } else if (admin.length) {
      const userData = {
        _id: admin[0]._id,
        email: admin[0].email,
        nome: admin[0].nome,
        senha: admin[0].senha,
        admin: true,
      }
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      showSuccess(`Bem vindo ${admin[0].nome}!`);
      navigate("/");
    } else if (funcionario.length) {
      const userData = {
        _id: funcionario[0]._id,
        email: funcionario[0].email,
        equipe: {
          _id: funcionario[0].equipe._id,
          nome: funcionario[0].equipe.nome
        },
        nome: funcionario[0].nome,
        senha: funcionario[0].senha,
        admin: false,
      }
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      showSuccess(`Bem vindo ${funcionario[0].nome}!`);
      navigate("/");
    }
  };
  
  return (
    <div className="m-auto d-flex flex-column container">
        <h1 className="h1 fw-bold text-center" style={{ color: '#Ec3239' }}>Entrar no sistema</h1>
        <Form style={{ width: "480px", margin: "auto" }}>
          <Form.Group className="mb-3" controlId="formGridAddress1" >
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-at"></i>
              </InputGroup.Text>
              <Form.Control 
                placeholder="Digite o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress1" >
            <Form.Label>Senha</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-key-fill"></i>
              </InputGroup.Text>
              <Form.Control 
                placeholder="Digite a sua senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <div className="row mb-3 d-flex flex-col">
            <CustomButton 
              className="col-6 mx-auto"
              onClick={validarUsuario}
            >
              Entrar
            </CustomButton>
          </div>
        </Form>
    </div>
  )
}

export default Login;