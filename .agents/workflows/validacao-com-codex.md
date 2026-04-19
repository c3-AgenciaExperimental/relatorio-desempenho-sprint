---
description: validação obrigatória com Codex após alterações de código
---

sempre que qualquer código for criado, editado, removido ou refatorado, ao final da tarefa abra o terminal na raiz do projeto e rode o Codex para revisar a alteração.

comando padrão:
codex "Revise as alterações que acabei de fazer neste projeto e verifique bugs, inconsistências, tipagem, regressões, impactos colaterais e aderência ao padrão do código."

só conclua a tarefa depois da checagem do Codex.
se o Codex apontar problema relevante, corrija e rode a checagem novamente.

se o Codex CLI não estiver instalado, instalar com:
npm i -g @openai/codex