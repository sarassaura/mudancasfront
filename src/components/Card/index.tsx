import type { JSX } from "react";
import { Button, Card } from "react-bootstrap";

interface RequestCardProps {
  title: string;
  team: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  description: string;
  onEdit: (id: string) => void;
  onInactivate: () => void;
  isActive?: boolean; 
  pedidoId: string;
}

function RequestCard({ title, team, startDate, endDate, vehicle, description, onEdit, onInactivate, isActive, pedidoId }: RequestCardProps): JSX.Element {
  const descriptionStyle = {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  };

  return (
    <div 
      style={{ 
        border: '1px solid #DEE2E6', 
        borderRadius: '12px', 
        padding: '24px', 
        width: '350px'
      }}
      className={isActive ? "" : "opacity-75 border-secondary"}
    >
      <Card.Title className="fw-bold mb-4">
        {title}
      </Card.Title>

      <div className="d-flex justify-content-between mb-4">
        <span className="text-secondary">
          Início: <span className="text-secondary">{startDate}</span>
        </span>
        <span className="text-secondary">
          Fim: <span className="text-secondary">{endDate}</span>
        </span>
      </div>

      <p className="mb-3 text-secondary">
        Equipe: <span className="text-secondary">{team}</span>
      </p>

      <p className="mb-3 text-secondary">
        Veículo: <span className="text-secondary">{vehicle}</span>
      </p>

      <Card.Text className="text-secondary" style={descriptionStyle}>
        Descrição: {description || "Nenhuma descrição fornecida."}
      </Card.Text>

      <div className="d-flex justify-content-between gap-2">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => onEdit(pedidoId)}      
        >
          <i className="bi bi-pencil-square me-1"></i> Editar
        </Button>
        <Button 
          variant={isActive ? "outline-danger" : "outline-success"} 
          size="sm" 
          onClick={onInactivate}
        >
          <i className={`bi ${isActive ? "bi-x-circle" : "bi-check-circle"} me-1`}></i> 
          {isActive ? 'Reativar' : 'Inativar'}
        </Button>
      </div>
    </div>
  );
}

export default RequestCard;