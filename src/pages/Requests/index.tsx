import { useState, type JSX, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosPedido, Equipe, Veiculo } from "../../types";
import CustomButton from "../../components/CustomButton";

function Requests(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId;
  const isEditMode = Boolean(editId);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [takeoutDate, setTakeoutDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<DadosPedido>({
    titulo: "",
    data_entrega: "",
    data_retirada: "",
    equipe: "",
    veiculo: "",
    descricao: "",
    status: "em-andamento",
  });

  const [equipes, setEquipes] = useState<Equipe[]>([]);
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
            data_entrega: pedidoData.data_entrega || "",
            data_retirada: pedidoData.data_retirada || "",
            equipe: pedidoData.equipe?._id || pedidoData.equipe || "",
            veiculo: pedidoData.veiculo?._id || pedidoData.veiculo || "",
            descricao: pedidoData.descricao || "",
            status: pedidoData.status || "em-andamento",
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
        const equipesResponse = await fetch(`${API_BASE_URL}/equipes`);
        const equipesData = await equipesResponse.json();
        setEquipes(equipesData);

        const veiculosResponse = await fetch(`${API_BASE_URL}/veiculos`);
        const veiculosData = await veiculosResponse.json();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipesResponse = await fetch(`${API_BASE_URL}/equipes`);
        const equipesData = await equipesResponse.json();
        setEquipes(equipesData);

        const veiculosResponse = await fetch(`${API_BASE_URL}/veiculos`);
        const veiculosData = await veiculosResponse.json();
        setVeiculos(veiculosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    if (deliveryDate) {
      setFormData((prev) => ({
        ...prev,
        data_entrega: formatDateToString(deliveryDate),
      }));
    }
  }, [deliveryDate]);

  useEffect(() => {
    if (takeoutDate) {
      setFormData((prev) => ({
        ...prev,
        data_retirada: formatDateToString(takeoutDate),
      }));
    }
  }, [takeoutDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.titulo ||
      !formData.data_entrega ||
      !formData.data_retirada ||
      !formData.equipe ||
      !formData.veiculo
    ) {
      showError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (isEditMode) {
        response = await fetch(`${API_BASE_URL}/pedidos/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        showSuccess(
          isEditMode
            ? "Pedido atualizado com sucesso!"
            : "Pedido cadastrado com sucesso!"
        );

        navigate("/gerenciar");
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
    if (location.state?.fromManage || isEditMode) {
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

          <Form.Group controlId="formGridDeliveryDate" className="col-6">
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

          <Form.Group controlId="formGridTakeoutDate" className="col-6">
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
              <option value="">Digite a equipe do Pedido</option>
              {equipes.map((equipe) => (
                <option key={equipe._id} value={equipe._id}>
                  {equipe.nome}
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
              <option value="">Digite o veículo do Pedido</option>
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
