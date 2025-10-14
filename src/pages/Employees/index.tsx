import { type JSX, useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosFuncionario, Equipe } from "../../types";

function Employees(): JSX.Element {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DadosFuncionario>({
    nome: "",
    equipe: "",
    email: "",
    senha: "",
  });

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const equipesResponse = await fetch(
          "http://localhost:5000/api/equipes"
        );
        const equipesData = await equipesResponse.json();
        setEquipes(equipesData);
      } catch (error) {
        console.error("Erro ao carregar equipes:", error);
      }
    };

    fetchEquipes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.nome ||
      !formData.equipe ||
      !formData.email ||
      !formData.senha
    ) {
      showError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/funcionarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess("Funcionário cadastrado com sucesso!");
        setFormData({
          nome: "",
          equipe: "",
          email: "",
          senha: "",
        });
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao cadastrar funcionário");
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto d-flex flex-column">
      <h1 className="h1 fw-bold text-primary text-center">
        Cadastro de Funcionário
      </h1>
      <Form style={{ width: "480px", margin: "auto" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o nome do Funcionário"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 mx-auto" controlId="formGridAddress1">
          <Form.Label>Equipe</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-people-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="equipe"
              value={formData.equipe}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Digite a equipe do Funcionário</option>
              {equipes.map((equipe) => (
                <option key={equipe._id} value={equipe._id}>
                  {equipe.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-at"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o email do Funcionário"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Senha</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-key-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite a senha do Funcionário"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>
        </Form.Group>

        <div className="row mb-3 d-flex flex-col">
          <Button
            variant="outline-primary"
            type="button"
            className="col-6 mx-auto"
            size="lg"
            style={{ width: "200px" }}
            onClick={() => navigate("/cadastrar")}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="col-6 mx-auto"
            size="lg"
            style={{ width: "200px" }}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Salvar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Employees;
