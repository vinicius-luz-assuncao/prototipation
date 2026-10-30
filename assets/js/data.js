/* =========================================================================
   VEM — Conteúdo do protótipo
   Textos reais em português. Nenhum dado de pesquisa é simulado:
   os números abaixo são conteúdo fictício de interface.
   ========================================================================= */

(function () {
  "use strict";

  var AVATAR = "assets/img/avatar.jpg";

  var data = {
    avatar: AVATAR,

    user: {
      firstName: "Ana",
      name: "Ana Beatriz",
      handle: "@anabeatriz",
      email: "ana.beatriz@email.com",
      level: 7,
      levelLabel: "Corredora",
      followers: "248",
      following: "132",
      friends: "36",
      bio: "Corro para organizar a cabeça. Yoga nos dias de descanso. Sempre procurando gente para treinar às 6h.",
      tags: ["5 km", "Yoga", "Força", "Iniciante"],
      goal: "Bem-estar"
    },

    matches: [
      {
        name: "Marina",
        age: 28,
        distance: "2,4 km",
        area: "Vila Madalena",
        compatibility: 87,
        bio: "Corro de manhã e cozinho à noite. Procuro companhia para os treinos de terça e quinta.",
        tags: ["Corrida", "5 km", "Yoga"],
        ring: "var(--vermilion)",
        tint: "linear-gradient(160deg,#f3c9a8,#c98e74 55%,#5d6f80)"
      },
      {
        name: "Camila",
        age: 31,
        distance: "1,2 km",
        area: "Pinheiros",
        compatibility: 82,
        bio: "Musculação três vezes por semana e caminhada no fim de semana. Sem pressa, sem cobrança.",
        tags: ["Força", "Caminhada", "Iniciante"],
        ring: "var(--sky)",
        tint: "linear-gradient(160deg,#bcd9e8,#7fa6b8 55%,#4d6172)"
      },
      {
        name: "Rafael",
        age: 26,
        distance: "3,8 km",
        area: "Perdizes",
        compatibility: 78,
        bio: "Yoga de manhã, escalada no fim de semana. Ainda aprendendo a correr sem parar.",
        tags: ["Yoga", "Escalada", "Corrida"],
        ring: "var(--sage)",
        tint: "linear-gradient(160deg,#cfe4d6,#9bb9a2 55%,#586c62)"
      },
      {
        name: "Luiza",
        age: 29,
        distance: "4,1 km",
        area: "Sumaré",
        compatibility: 74,
        bio: "Dança e natação. Quero voltar a treinar em grupo sem sentir que estou atrasada.",
        tags: ["Dança", "Natação", "Bem-estar"],
        ring: "var(--plum)",
        tint: "linear-gradient(160deg,#e8c6d2,#c294a5 55%,#6c5561)"
      }
    ],

    connections: [
      { name: "Marina Costa", detail: "Treinou com você 2×", group: "Corrida · terças", ring: "var(--vermilion)" },
      { name: "Camila Reis", detail: "Academia Vem · Pinheiros", group: "Força · seg e qua", ring: "var(--sky)" },
      { name: "Rafael Nunes", detail: "Yoga no parque", group: "Yoga · domingos", ring: "var(--sage)" },
      { name: "Luiza Prado", detail: "Amiga desde março", group: "Dança · sextas", ring: "var(--plum)" },
      { name: "Bruna Alves", detail: "Corrida no Ibirapuera", group: "Corrida · sábados", ring: "var(--amber)" },
      { name: "Diego Matos", detail: "Natação livre", group: "Natação · manhãs", ring: "var(--sky)" }
    ],

    groups: [
      { name: "Corrida às 6h", detail: "24 membros · Ibirapuera", icon: "run", tint: "circle--vermilion" },
      { name: "Yoga para começar", detail: "18 membros · online", icon: "lotus", tint: "circle--sage" },
      { name: "Força sem julgamento", detail: "31 membros · Pinheiros", icon: "dumbbell", tint: "circle--amber" },
      { name: "Natação livre", detail: "12 membros · Clube Paulista", icon: "swim", tint: "circle--sky" }
    ],

    /* Jornadas adaptativas — a escolha da tela 05 ramifica o fluxo
       e troca o card inteligente da Home. start = primeira tela após o onboarding. */
    journeys: {
      social: {
        label: "Se conectar",
        short: "Social",
        start: "12",
        card: {
          badge: "Perto de você",
          title: "3 pessoas com o mesmo interesse",
          text: "Encontramos <strong>3 pessoas em Pinheiros</strong> que também curtem Yoga e treinam no seu horário. Quer ver quem são?",
          meta: ["Yoga", "Pinheiros", "82% combinam"],
          cta: "Ver pessoas",
          target: "12"
        }
      },
      self: {
        label: "Autocuidado",
        short: "Evolução",
        start: "11",
        card: {
          badge: "Sua semana",
          title: "Sua meta está em 60%",
          text: "Você treinou <strong>3 de 5 vezes</strong> esta semana. Que tal um treino rápido de 15 min para fechar o dia?",
          meta: ["15 min", "em casa", "leve"],
          cta: "Ver treino",
          target: "13"
        }
      },
      events: {
        label: "Eventos e comunidade",
        short: "Eventos",
        start: "15",
        card: {
          badge: "No seu bairro",
          title: "Corrida de rua no sábado",
          text: "Há um <strong>evento de corrida de 5 km</strong> no seu bairro neste sábado, às 7h. Quer se inscrever?",
          meta: ["Sáb · 07h", "5 km", "Ibirapuera"],
          cta: "Ver evento",
          target: "13"
        }
      }
    },

    /* Sugestões geradas (GenUI) — chave = intenção detectada na LUI */
    suggestions: {
      yoga: {
        title: "Yoga para aliviar o estresse",
        text: "Encontrei um treino de <strong>Yoga de 20 min</strong> para aliviar seu estresse, baseado no seu perfil e no seu sono.",
        meta: ["20 min", "Iniciante", "em casa"],
        tag: "Yoga"
      },
      corrida: {
        title: "Corrida leve de 25 min",
        text: "Você pediu corrida. Montei um <strong>trote de 25 min</strong> com caminhada nos intervalos, no ritmo do seu último treino.",
        meta: ["25 min", "5 km", "ao ar livre"],
        tag: "Corrida"
      },
      forca: {
        title: "Força de corpo inteiro",
        text: "Separei um treino de <strong>força de 40 min</strong> com halteres, focado em pernas e costas — o que você menos treinou no mês.",
        meta: ["40 min", "Intermediário", "academia"],
        tag: "Força"
      },
      hiit: {
        title: "HIIT curto para o dia cheio",
        text: "Seu dia tem 20 min livres. Preparei um <strong>HIIT de 15 min</strong>, sem equipamento, para fazer em casa.",
        meta: ["15 min", "Intenso", "em casa"],
        tag: "HIIT"
      },
      danca: {
        title: "Dança para soltar o corpo",
        text: "Você marcou dança nos interesses. Encontrei uma <strong>aula de 30 min</strong> de ritmos brasileiros, para todos os níveis.",
        meta: ["30 min", "Todos os níveis", "em casa"],
        tag: "Dança"
      },
      nadar: {
        title: "Natação em ritmo tranquilo",
        text: "Montei uma <strong>sessão de 40 min</strong> na piscina, com foco em respiração e braçada livre. Sem cobrança de tempo.",
        meta: ["40 min", "Iniciante", "piscina"],
        tag: "Natação"
      },
      default: {
        title: "Treino de 30 min para hoje",
        text: "Encontrei um treino de <strong>30 min</strong> que combina caminhada e mobilidade, no seu ritmo e com o tempo que você tem hoje.",
        meta: ["30 min", "Iniciante", "em casa"],
        tag: "Movimento"
      }
    },

    /* Intenções reconhecidas pela LUI (demo de linguagem natural) */
    intents: [
      { keys: ["yoga", "alongar", "estresse", "ansiedade", "respirar"], intent: "yoga" },
      { keys: ["correr", "corrida", "5 km", "5km", "trote"], intent: "corrida" },
      { keys: ["força", "forca", "musculação", "musculacao", "halter", "perna", "costas"], intent: "forca" },
      { keys: ["hiit", "rápido", "rapido", "15", "20 min", "intenso"], intent: "hiit" },
      { keys: ["dança", "danca", "dançar", "dancar", "ritmo"], intent: "danca" },
      { keys: ["nadar", "natação", "natacao", "piscina", "braçada"], intent: "nadar" }
    ]
  };

  window.VEM_DATA = data;
})();
