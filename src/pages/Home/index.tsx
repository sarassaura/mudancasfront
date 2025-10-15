import { useContext, type JSX } from "react";
import ButtonLink from "../../components/Button";
import UserContext from "../../context/user";

function Home(): JSX.Element {
  const { user } = useContext(UserContext)!;
  return (
    <div className="mx-auto d-flex flex-column gap-3">
        {user?.admin && (
          <ButtonLink url="/cadastrar">Cadastrar</ButtonLink>
        )}
        <ButtonLink url="/pedidos-mudanca">Pedidos de Mudança</ButtonLink>
        <ButtonLink url="/premiacoes">Premiações</ButtonLink>
        <ButtonLink url="/gerenciar">Gerenciar</ButtonLink>
    </div>
  )
}

export default Home;