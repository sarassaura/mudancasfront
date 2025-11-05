import type { JSX } from "react";
import { Button, Card } from "react-bootstrap";

interface Funcionario {
  nome: string;
}

interface Autonomo {
  nome: string;
}

interface RequestCardProps {
  title: string;
  data_embalagem?: string;
  data_retirada: string;
  data_entrega: string;
  funcionarios?: Funcionario[];
  autonomos?: Autonomo[];
  vehicle: string;
  description: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  pedidoId: string;
  cardColor: string;
}

function RequestCard({ 
  title, 
  data_embalagem, 
  data_retirada,
  data_entrega,
  funcionarios = [],
  autonomos = [], 
  vehicle, 
  description, 
  onEdit, 
  onDelete, 
  pedidoId,
  cardColor
}: RequestCardProps): JSX.Element {
  const descriptionStyle = {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  };

  const cardStyle = {
    border: '1px solid #DEE2E6',
    borderRadius: '12px', 
    padding: '24px', 
    width: '400px',
    backgroundColor: cardColor,
    display: 'flex',              
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
  };

  return (
    <div style={cardStyle}>
      <div>
        <Card.Title className="fw-bold mb-4">
          {title}
        </Card.Title>

        <div className="d-flex flex-column align-items-center mb-4 text-secondary">
          <div className="d-flex justify-content-between gap-4">
            <span>Embalagem: {data_embalagem}</span>
            <span>Retirada: {data_retirada}</span>
          </div>
          <div >
            <span>Entrega: {data_entrega}</span>
          </div>
        </div>

        {funcionarios.length > 0 && (
          <p className="mb-3 text-secondary">
            Funcionários: {funcionarios.map(f => f.nome).join(", ")}
          </p>
        )}

        {autonomos.length > 0 && (
          <p className="mb-3 text-secondary">
            Autônomos: {autonomos.map(a => a.nome).join(", ")}
          </p>
        )}

        <p className="mb-3 text-secondary">
          Veículo: <span>{vehicle}</span>
        </p>

        <Card.Text className="text-secondary" style={descriptionStyle}>
          Descrição: {description || "Nenhuma descrição fornecida."}
        </Card.Text>
      </div>

      <div className="d-flex justify-content-between gap-2 mt-3">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => onEdit(pedidoId)}
        >
          <i className="bi bi-pencil-square me-1"></i> Editar
        </Button>
        <Button 
          size="sm" 
          variant="outline-danger" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(pedidoId);
          }}
        >
          <i className="bi bi-x-circle me-1"></i>  Excluir
        </Button>
      </div>
    </div>
  );
}

export default RequestCard;