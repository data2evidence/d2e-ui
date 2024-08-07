import { Backend } from "./backend";
import { WhiteRabbit } from "./white-rabbit";

export const api = {
  backend: new Backend(),
  whiteRabbit: new WhiteRabbit(),
};
