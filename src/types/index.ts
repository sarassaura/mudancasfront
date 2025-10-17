export interface DadosAdmin {
  nome: string;
  email: string;
  senha: string;
  status: "ativo" | "inativado";
}

export interface DadosPedido {
  titulo: string;
  data_entrega: string;
  data_retirada: string;
  equipe: string;
  veiculo: string;
  descricao?: string;
  status: "em-andamento" | "inativado";
}

export interface DadosEquipe {
  nome: string;
  status: "ativo" | "inativado";
}

export interface Equipe {
  _id: string;
  nome: string;
  status: "ativo" | "inativado";
}

export interface DadosVeiculo {
  nome: string;
  status: "ativo" | "inativado";
}

export interface Veiculo {
  _id: string;
  nome: string;
  status: "ativo" | "inativado";
}

export interface DadosFuncionario {
  nome: string;
  email: string;
  senha: string;
  equipe: string;
  status: "ativo" | "inativado";
}

export interface DadosAutonomo {
  nome: string;
  status: "ativo" | "inativado";
}

export interface Autonomo {
  _id: string;
  nome: string;
  status: "ativo" | "inativado";
}

export interface DadosHorasAutonomo {
  data: string;
  hora: string;
  autonomo: string;
  pernoite: boolean;
  status: "ativo" | "inativado";
}
