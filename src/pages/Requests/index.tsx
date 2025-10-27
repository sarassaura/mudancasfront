import { useState, type JSX, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type {
  DadosPedido,
  Equipe,
  Veiculo,
  Funcionario,
  Autonomo,
} from "../../types";
import CustomButton from "../../components/CustomButton";

function Requests(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId;
  const isEditMode = Boolean(editId);
  const [packingDate, setPackingDate] = useState<Date | null>(null);
  const [takeoutDate, setTakeoutDate] = useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<DadosPedido>({
    titulo: "",
    data_embalagem: "",
    data_retirada: "",
    data_entrega: "",
    equipe: "",
    funcionario: "",
    autonomo: "",
    veiculo: "",
    descricao: "",
  });

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [autonomos, setAutonomos] = useState<Autonomo[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchPedidoData = async () => {
      if (isEditMode && editId) {
        setFetching(true);
        try {
          const response = await fetch(`${API_BASE_URL}/pedidos/${editId}`);

          if (!response.ok) {
            throw new Error("Erro ao carregar dados do pedido");
          }

          const pedidoData = await response.json();

          setFormData({
            titulo: pedidoData.titulo || "",
            data_embalagem: pedidoData.data_embalagem || "",
            data_retirada: pedidoData.data_retirada || "",
            data_entrega: pedidoData.data_entrega || "",
            equipe: pedidoData.equipe?._id || pedidoData.equipe || "",
            funcionario:
              pedidoData.funcionario?._id || pedidoData.funcionario || "",
            autonomo: pedidoData.autonomo?._id || pedidoData.autonomo || "",
            veiculo: pedidoData.veiculo?._id || pedidoData.veiculo || "",
            descricao: pedidoData.descricao || "",
          });
        } catch (error) {
          showError("Erro ao carregar dados para edição");
          console.error("Erro:", error);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchPedidoData();
  }, [isEditMode, editId, API_BASE_URL]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          equipesResponse,
          funcionariosResponse,
          autonomosResponse,
          veiculosResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/equipes`),
          fetch(`${API_BASE_URL}/funcionarios`),
          fetch(`${API_BASE_URL}/autonomos`),
          fetch(`${API_BASE_URL}/veiculos`),
        ]);

        const equipesData = await equipesResponse.json();
        const funcionariosData = await funcionariosResponse.json();
        const autonomosData = await autonomosResponse.json();
        const veiculosData = await veiculosResponse.json();

        setEquipes(equipesData);
        setFuncionarios(funcionariosData);
        setAutonomos(autonomosData);
        setVeiculos(veiculosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (packingDate) {
      setFormData((prev) => ({
        ...prev,
        data_embalagem: formatDateToString(packingDate),
      }));
    }
  }, [packingDate]);

  useEffect(() => {
    if (takeoutDate) {
      setFormData((prev) => ({
        ...prev,
        data_retirada: formatDateToString(takeoutDate),
      }));
    }
  }, [takeoutDate]);

  useEffect(() => {
    if (deliveryDate) {
      setFormData((prev) => ({
        ...prev,
        data_entrega: formatDateToString(deliveryDate),
      }));
    }
  }, [deliveryDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.titulo ||
      !formData.data_embalagem ||
      !formData.data_entrega ||
      !formData.data_retirada ||
      !formData.equipe ||
      !formData.veiculo
    ) {
      showError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    if (!formData.funcionario && !formData.autonomo) {
      showError("O pedido deve ter pelo menos um Funcionário ou um Autônomo.");
      setLoading(false);
      return;
    }

    try {
      let response;
      const dataToSend = formData;
      if (isEditMode) {
        response = await fetch(`${API_BASE_URL}/pedidos/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      }

      if (response.ok) {
        showSuccess(
          isEditMode
            ? "Pedido atualizado com sucesso!"
            : "Pedido cadastrado com sucesso!"
        );

        if (location.state?.fromDeliveryRequests) {
          navigate("/pedidos-mudanca");
        } else {
          navigate("/gerenciar");
        }
      } else {
        const errorData = await response.json();
        showError(
          errorData.message ||
            `Erro ao ${isEditMode ? "atualizar" : "cadastrar"} pedido`
        );
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state?.fromDeliveryRequests) {
      navigate("/pedidos-mudanca");
    } else if (location.state?.fromManage) {
      navigate("/gerenciar");
    } else if (isEditMode) {
      navigate("/gerenciar");
    } else {
      navigate("/cadastrar");
    }
  };

  if (fetching) {
    return (
      <div className="container my-auto text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="container my-auto">
      <h1
        className="h1 fw-bold text-center w-100 mt-3"
        style={{ color: "#Ec3239" }}
      >
        {isEditMode ? "Editar Pedido" : "Cadastro de Pedidos"}
      </h1>
      <Form
        className="mx-auto w-100"
        style={{ maxWidth: "480px" }}
        onSubmit={handleSubmit}
      >
        <div className="row mb-3">
          <Form.Group className="mb-3 mx-auto" controlId="formGridAddress1">
            <Form.Label>Título</Form.Label>
            <Form.Control
              placeholder="Digite o título do Pedido"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              disabled={loading || fetching}
            />
          </Form.Group>

          <Form.Group controlId="formGridPackingDate" className="col-4">
            <Form.Label>Data da Embalagem</Form.Label>
            <InputGroup className="flex-nowrap">
              <InputGroup.Text>
                <i className="bi bi-calendar-week"></i>
              </InputGroup.Text>
              <DatePicker
                selected={packingDate}
                onChange={(date) => setPackingDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0"
                placeholderText="dd/mm/aaaa"
                disabled={loading || fetching}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formGridTakeoutDate" className="col-4">
            <Form.Label>Data da Retirada</Form.Label>
            <InputGroup className="flex-nowrap">
              <InputGroup.Text>
                <i className="bi bi-calendar-week"></i>
              </InputGroup.Text>
              <DatePicker
                selected={takeoutDate}
                onChange={(date) => setTakeoutDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0"
                placeholderText="dd/mm/aaaa"
                disabled={loading || fetching}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formGridDeliveryDate" className="col-4">
            <Form.Label>Data da Entrega</Form.Label>
            <InputGroup className="flex-nowrap">
              <InputGroup.Text>
                <i className="bi bi-calendar-week"></i>
              </InputGroup.Text>
              <DatePicker
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0"
                placeholderText="dd/mm/aaaa"
                disabled={loading || fetching}
              />
            </InputGroup>
          </Form.Group>
        </div>

        <Form.Group className="mb-3" controlId="formGridTeam">
          <Form.Label>Equipe</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-people-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="equipe"
              value={formData.equipe}
              onChange={handleInputChange}
              disabled={loading || fetching}
            >
              <option value="">Selecione a Equipe</option>
              {equipes.map((equipe) => (
                <option key={equipe._id} value={equipe._id}>
                  {equipe.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridFuncionarios">
          <Form.Label>Funcionários</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="funcionario"
              value={formData.funcionario}
              onChange={handleInputChange}
              disabled={loading || fetching}
            >
              <option value="" disabled>
                Selecione o(s) Funcionário(s)
              </option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario._id} value={funcionario._id}>
                  {funcionario.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAutonomos">
          <Form.Label>Autônomos</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="autonomo"
              value={formData.autonomo}
              onChange={handleInputChange}
              disabled={loading || fetching}
            >
              <option value="" disabled>
                Selecione o(s) Autônomo(s)
              </option>
              {autonomos.map((autonomo) => (
                <option key={autonomo._id} value={autonomo._id}>
                  {autonomo.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridVehicle">
          <Form.Label>Veículo</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-car-front-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="veiculo"
              value={formData.veiculo}
              onChange={handleInputChange}
              disabled={loading || fetching}
            >
              <option value="">Selecione o Veículo</option>
              {veiculos.map((veiculo) => (
                <option key={veiculo._id} value={veiculo._id}>
                  {veiculo.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridNotes">
          <Form.Control
            as="textarea"
            placeholder="Informações Adicionais"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            disabled={loading || fetching}
            style={{
              width: "100%",
              minHeight: "114px",
              resize: "none",
            }}
          />
        </Form.Group>

        <div className="row mb-3 d-flex flex-col gap-3">
          <CustomButton
            type="button"
            className="col-6 mx-auto"
            onClick={handleBack}
            disabled={loading || fetching}
            isOutline
          >
            Voltar
          </CustomButton>
          <CustomButton
            type="submit"
            className="col-6 mx-auto"
            disabled={loading || fetching}
          >
            {loading
              ? isEditMode
                ? "Atualizando..."
                : "Cadastrando..."
              : isEditMode
              ? "Atualizar"
              : "Salvar"}
          </CustomButton>
        </div>
      </Form>
    </div>
  );
}

export default Requests;
