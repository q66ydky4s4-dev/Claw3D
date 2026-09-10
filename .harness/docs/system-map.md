# Mapa modular do sistema completo

```mermaid
flowchart TB
  H[Harness Core] --> O[Orquestração]
  H --> E[Engenharia]
  H --> A[Assurance]
  H --> D[Entrega]
  H --> K[Conhecimento]
  O --> O1[Parte 1: manifesto, agentes centrais, prompts, workflows]
  E --> E1[Parte 2: frontend, backend, dados, integrações — 0.2.0]
  A --> A1[Parte 3: QA, segurança, performance, acessibilidade]
  D --> D1[Parte 4: CI/CD, ambientes, observabilidade, incidentes]
  K --> K1[Parte 5: documentação, decisões, memória, métricas]
  K --> K2[Parte 6: crescimento, analytics, experimentação]
```

## Fluxo operacional

```mermaid
flowchart LR
  I[Intake] --> P[Planejar]
  P --> R{Risco/ambiguidade?}
  R -->|arquitetura| A[Arquitetar]
  R -->|baixo| B[Implementar]
  A --> B
  B --> V[Revisar]
  V --> Q[Testar]
  Q --> G{Gates aprovados?}
  G -->|não| B
  G -->|sim| S[Preparar release]
  S --> C[Registrar decisão e resultado]
```

## Contratos entre módulos

Cada workflow declara entradas, etapas, gates e saídas. Cada agente define
responsabilidade, limites e formato de handoff. Prompts coletam contexto;
checklists verificam evidências. O manifesto lista os componentes publicáveis.

## Partes planejadas

| Parte | Escopo | Saída principal |
|---|---|---|
| 1 | Fundação e núcleo | Harness portátil e validado |
| 2 | Domínios de produto | Agentes e padrões de implementação |
| 3 | Qualidade avançada | Gates e matrizes de risco |
| 4 | Operação | Pipelines e runbooks |
| 5 | Conhecimento | ADRs, memória e governança |
| 6 | Produto e growth | Métricas e experimentação |
| 7 | Integrações | Adaptadores Hermes/MCP/serviços |
| 8 | Avaliação | Evals, benchmarks e maturidade |

All eight parts are delivered in version 1.0.0.
