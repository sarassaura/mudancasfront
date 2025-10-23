import type { JSX } from "react";
import { Button, Card } from "react-bootstrap";

interface RequestCardProps {
  title: string;
  team: string;
  packingDate: string;
  takeoutDate: string;
  deliveryDate: string;
  vehicle: string;
  description: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  pedidoId: string;
  cardColor: string;
}

function RequestCard({ 
  title, 
  team, 
  packingDate, 
  takeoutDate,
  deliveryDate, 
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
    width: '350px',
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

        <div className="d-flex justify-content-center gap-4 mb-4 text-secondary">
          <span>
            Embalagem: <span>{packingDate}</span>
          </span>
          <span>
            Retirada: <span>{takeoutDate}</span>
          </span>
          <span>
            Entrega: <span>{deliveryDate}</span>
          </span>
        </div>

        <p className="mb-3 text-secondary">
          Equipe: <span>{team}</span>
        </p>

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
          onClick={() => onDelete(pedidoId)}
        >
          <i className="bi bi-x-circle me-1"></i>  Excluir
        </Button>
      </div>
    </div>
  );
}

export default RequestCard;