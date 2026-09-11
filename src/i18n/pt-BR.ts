import type { Copy } from "./index";

/**
 * Portuguese copy.
 *
 * `satisfies Copy` is the completeness gate: a key present in `en.ts` and
 * missing or misspelled here is a build failure under `tsc --noEmit`, not a
 * blank on the page. See ADR-0002.
 *
 * Transcreated, not translated — the design was authored in Portuguese and
 * the English is derived from it. The golf vocabulary is fixed in CONTEXT.md.
 */
export const ptBR = {
  contact: {
    eyebrow: "Solicite um assessment",
    heading: "Traga um ambiente. Devolvemos o cartão dele.",
    blurb:
      "Um assessment de cortesia em até cinco instâncias: workload, configuração, segurança e o dimensionamento que elas deveriam ter. Sem instalar nada.",

    name: "Nome",
    email: "E-mail corporativo",
    company: "Empresa",
    message: "O que você quer que a gente leia?",
    messagePlaceholder: "Quais bancos, quantas instâncias mais ou menos, algo específico.",
    optional: "opcional",

    submit: "Solicitar o assessment",
    sending: "Enviando…",
    successTitle: "Recebido.",
    successBody: "Respondemos de info@datacaddy.co em até um dia útil.",
    errorTitle: "O envio não foi concluído.",
    errorBody: "Tente de novo, ou escreva direto para info@datacaddy.co.",

    required: "Preencha este campo.",
    invalidEmail: "Isso não parece um e-mail.",

    consent: "Ao enviar, você concorda que usemos seus dados para responder a você.",
    consentLink: "Como tratamos isso",
    orEmail: "Ou escreva para",
  },

  privacy: {
    title: "Como tratamos seus dados",
    updated: "Atualizado em 11 de setembro de 2026",
    body: [
      {
        h: "Quem é o responsável",
        p: "A ASO DB Solutions é a controladora dos dados pessoais enviados por este formulário. Fale conosco em info@datacaddy.co.",
      },
      {
        h: "O que coletamos, e para quê",
        p: "Somente o que você digita: nome, e-mail corporativo, empresa e sua mensagem. Usamos para uma única finalidade — responder sobre o assessment que você pediu. Não usamos para listas de marketing, e não vendemos nem compartilhamos.",
      },
      {
        h: "Para onde vai",
        p: "O formulário é processado pela Netlify, que hospeda este site, e a notificação chega à nossa caixa no Microsoft 365. Ambas são operadoras agindo sob nossas instruções.",
      },
      {
        h: "Por quanto tempo guardamos",
        p: "Enquanto a conversa estiver ativa, e por até 12 meses depois que ela terminar. Depois disso, é excluído.",
      },
      {
        h: "Seus direitos",
        p: "Pela LGPD você pode pedir quais dados temos sobre você, corrigi-los ou solicitar a exclusão. Escreva para info@datacaddy.co e respondemos dentro do prazo legal.",
      },
    ],
    close: "Fechar",
  },
} satisfies Copy;
