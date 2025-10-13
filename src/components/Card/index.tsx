import type { JSX } from "react";
import { Card } from "react-bootstrap";

interface RequestCardProps {
  team: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  description: string;
}

function RequestCard({ team, startDate, endDate, vehicle, description }: RequestCardProps): JSX.Element {
  return (
    <div style={{ 
      border: '1px solid #DEE2E6', 
      borderRadius: '12px', 
      padding: '24px', 
      width: '350px'
    }}>
      <Card.Title className="fw-bold mb-3">
        Equipe: {team}
      </Card.Title>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-secondary">
          Início: <span className="text-secondary">{startDate}</span>
        </span>
        <span className="text-secondary">
          Fim: <span className="text-secondary">{endDate}</span>
        </span>
      </div>

      <p className="mb-3 text-secondary">
        Veículo: <span className="text-secondary">{vehicle}</span>
      </p>

      <Card.Text className="text-secondary">
        {description}
      </Card.Text>
    </div>
  );
}

export default RequestCard;