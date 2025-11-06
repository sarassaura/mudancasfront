export interface DadosAdmin {
  nome: string;
  email: string;
  senha: string;
}

export interface DadosPedido {
  titulo: string;
  data_embalagem: string;
  data_retirada: string;
  data_entrega: string;
  equipe: string;
  funcionario: string;
  autonomo: string;
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
export interface Funcionario {
  _id: string;
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
  autonomo: string;
  data: string;
  escada: boolean;
  data_escada: string;
  valor: string;
}
