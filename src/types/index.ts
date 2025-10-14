export interface DadosAdmin {
  nome: string;
  email: string;
  senha: string;
}

export interface DadosPedido {
  data_entrega: string;
  data_retirada: string;
  equipe: string;
  veiculo: string;
  descricao?: string;
}

export interface DadosEquipe {
  nome: string;
}

export interface Equipe {
  _id: string;
  nome: string;
}

export interface DadosVeiculo {
  nome: string;
}

export interface Veiculo {
  _id: string;
  nome: string;
}

export interface DadosFuncionario {
  nome: string;
  email: string;
  senha: string;
  equipe: string;
}

export interface DadosAutonomo {
  nome: string;
}

export interface Autonomo {
  _id: string;
  nome: string;
}

export interface DadosHorasAutonomo {
  data: string;
  hora: string;
  autonomo: string;
  pernoite: boolean;
}
