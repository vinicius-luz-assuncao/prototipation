/* =========================================================================
   VEM — Conteúdo do protótipo · rodada de testes v2
   Textos reais em português. Nenhum dado de pesquisa é simulado:
   os números abaixo são conteúdo fictício de interface.
   ========================================================================= */

(function () {
  "use strict";

  var AVATAR = "assets/img/avatar.jpg";
  var AVATAR_2 = "assets/img/avatar_2.jpg";
  var AVATAR_ANA = "assets/img/ana-beatriz-avatar.jpg";
  var AVATAR_MARINA = "assets/img/marina-avatar.jpg";
  var AVATAR_CAMILA = "assets/img/camila-avatar.jpg";
  var AVATAR_RAFAEL = "assets/img/rafael-avatar.jpg";
  var AVATAR_LUIZA = "assets/img/luiza-avatar.jpg";
  var AVATAR_BRUNA = "assets/img/bruna-avatar.jpg";

  /* -----------------------------------------------------------------------
     Atividades — 50 categorias + emoji. O emoji substitui ícones desenhados.
     ----------------------------------------------------------------------- */

  var activities = [
    { slug: "yoga", label: "Yoga", emoji: "🧘" },
    { slug: "pilates", label: "Pilates", emoji: "🤸" },
    { slug: "musculacao", label: "Musculação", emoji: "🏋️" },
    { slug: "crossfit", label: "Crossfit", emoji: "🏋️" },
    { slug: "funcional", label: "Funcional", emoji: "🤸" },
    { slug: "hiit", label: "HIIT", emoji: "⚡" },
    { slug: "calistenia", label: "Calistenia", emoji: "💪" },
    { slug: "alongamento", label: "Alongamento", emoji: "🤸" },
    { slug: "corrida", label: "Corrida", emoji: "🏃" },
    { slug: "caminhada", label: "Caminhada", emoji: "🚶" },
    { slug: "ciclismo", label: "Ciclismo", emoji: "🚴" },
    { slug: "natacao", label: "Natação", emoji: "🏊" },
    { slug: "hidroginastica", label: "Hidroginástica", emoji: "💧" },
    { slug: "remo", label: "Remo", emoji: "🚣" },
    { slug: "canoagem", label: "Canoagem", emoji: "🛶" },
    { slug: "surf", label: "Surf", emoji: "🏄" },
    { slug: "skate", label: "Skate", emoji: "🛹" },
    { slug: "patins", label: "Patins", emoji: "🛼" },
    { slug: "patinacao", label: "Patinação", emoji: "⛸️" },
    { slug: "escalada", label: "Escalada", emoji: "🧗" },
    { slug: "trilha", label: "Trilha", emoji: "🥾" },
    { slug: "boxe", label: "Boxe", emoji: "🥊" },
    { slug: "muay-thai", label: "Muay thai", emoji: "🥊" },
    { slug: "jiu-jitsu", label: "Jiu-jitsu", emoji: "🥋" },
    { slug: "judo", label: "Judô", emoji: "🥋" },
    { slug: "taekwondo", label: "Taekwondo", emoji: "🥋" },
    { slug: "karate", label: "Karatê", emoji: "🥋" },
    { slug: "capoeira", label: "Capoeira", emoji: "🤸" },
    { slug: "esgrima", label: "Esgrima", emoji: "🤺" },
    { slug: "arco-e-flecha", label: "Arco e flecha", emoji: "🏹" },
    { slug: "futebol", label: "Futebol", emoji: "⚽" },
    { slug: "futsal", label: "Futsal", emoji: "⚽" },
    { slug: "volei", label: "Vôlei", emoji: "🏐" },
    { slug: "volei-de-praia", label: "Vôlei de praia", emoji: "🏐" },
    { slug: "beach-tennis", label: "Beach tennis", emoji: "🎾" },
    { slug: "basquete", label: "Basquete", emoji: "🏀" },
    { slug: "handebol", label: "Handebol", emoji: "🤾" },
    { slug: "rugby", label: "Rugby", emoji: "🏉" },
    { slug: "beisebol", label: "Beisebol", emoji: "⚾" },
    { slug: "tenis", label: "Tênis", emoji: "🎾" },
    { slug: "tenis-de-mesa", label: "Tênis de mesa", emoji: "🏓" },
    { slug: "badminton", label: "Badminton", emoji: "🏸" },
    { slug: "squash", label: "Squash", emoji: "🎾" },
    { slug: "golfe", label: "Golfe", emoji: "⛳" },
    { slug: "danca", label: "Dança", emoji: "💃" },
    { slug: "danca-de-salao", label: "Dança de salão", emoji: "💃" },
    { slug: "ginastica", label: "Ginástica", emoji: "🤸" },
    { slug: "meditacao", label: "Meditação ativa", emoji: "🧘" },
    { slug: "levantamento-de-peso", label: "Levantamento de peso", emoji: "🏋️" },
    { slug: "hipismo", label: "Hipismo", emoji: "🐎" }
  ];

  var broadTags = [
    { slug: "espaco-aberto", label: "Espaço aberto", emoji: "🌳" },
    { slug: "indoor", label: "Indoor", emoji: "🏠" },
    { slug: "em-grupo", label: "Em grupo", emoji: "👥" },
    { slug: "individual", label: "Individual", emoji: "🙋" },
    { slug: "ao-ar-livre", label: "Ao ar livre", emoji: "☀️" },
    { slug: "competitivo", label: "Competitivo", emoji: "🏁" },
    { slug: "recreativo", label: "Recreativo", emoji: "😊" },
    { slug: "matinal", label: "Matinal", emoji: "🌅" },
    { slug: "noturno", label: "Noturno", emoji: "🌙" },
    { slug: "fim-de-semana", label: "Fim de semana", emoji: "📅" },
    { slug: "intenso", label: "Intenso", emoji: "🔥" },
    { slug: "leve", label: "Leve", emoji: "🍃" },
    { slug: "com-musica", label: "Com música", emoji: "🎵" },
    { slug: "silencioso", label: "Silencioso", emoji: "🤫" },
    { slug: "com-equipamento", label: "Com equipamento", emoji: "🏋️" },
    { slug: "sem-equipamento", label: "Sem equipamento", emoji: "🙌" },
    { slug: "adaptado", label: "Adaptado", emoji: "♿" },
    { slug: "iniciante", label: "Iniciante", emoji: "🌱" },
    { slug: "avancado", label: "Avançado", emoji: "🚀" }
  ];

  /* Contextos principais exibidos na tela 06 (Interesses) — a busca revela
     os demais contextos da lista acima. */
  var broadPrimary = [
    "ao-ar-livre",
    "indoor",
    "em-grupo",
    "individual",
    "leve",
    "intenso"
  ];

  /* Atividades sugeridas (atalhos) na tela 06, antes da busca. */
  var suggestedActivities = [
    "yoga",
    "corrida",
    "musculacao",
    "danca",
    "natacao",
    "caminhada"
  ];

  /* -----------------------------------------------------------------------
     Pessoas e eventos do cenário simulado
     ----------------------------------------------------------------------- */

  var people = {
    ana: {
      id: "ana",
      name: "Ana Beatriz",
      age: 27,
      distance: "1,6 km",
      area: "Pinheiros",
      compatibility: 84,
      bio: "Corro no fim da tarde e faço yoga quando o corpo pede pausa. Procuro gente para treinar sem cobrança.",
      activities: ["corrida", "yoga"],
      level: "Intermediária",
      groups: ["corrida-6h"],
      ring: "var(--amber)",
      avatar: AVATAR_ANA,
      photo: "assets/img/ana-beatriz.jpg",
      tint: "linear-gradient(160deg,#dae35a 0%,#c799c8 55%,#302437 100%)"
    },
    marina: {
      id: "marina",
      name: "Marina",
      age: 28,
      distance: "2,4 km",
      area: "Vila Madalena",
      compatibility: 87,
      bio: "Corro de manhã e cozinho à noite. Procuro companhia para os treinos de terça e quinta.",
      activities: ["corrida", "yoga"],
      level: "Intermediária",
      groups: ["yoga-ibirapuera", "corrida-6h"],
      likedYou: true,
      ring: "var(--vermilion)",
      avatar: AVATAR_MARINA,
      photo: "assets/img/marina.jpg",
      tint: "linear-gradient(160deg,#f77cc5 0%,#c799c8 55%,#66416b 100%)"
    },
    camila: {
      id: "camila",
      name: "Camila",
      age: 31,
      distance: "1,2 km",
      area: "Pinheiros",
      compatibility: 82,
      bio: "Musculação três vezes por semana e caminhada no fim de semana. Sem pressa, sem cobrança.",
      activities: ["musculacao", "caminhada"],
      level: "Iniciante",
      groups: ["forca-pinheiros"],
      ring: "var(--sky)",
      avatar: AVATAR_CAMILA,
      photo: "assets/img/camila.jpg",
      tint: "linear-gradient(160deg,#f57335 0%,#c799c8 55%,#4a3450 100%)"
    },
    rafael: {
      id: "rafael",
      name: "Rafael",
      age: 26,
      distance: "3,8 km",
      area: "Perdizes",
      compatibility: 78,
      bio: "Yoga de manhã, escalada no fim de semana. Ainda aprendendo a correr sem parar.",
      activities: ["yoga", "escalada", "corrida"],
      level: "Intermediário",
      groups: ["yoga-ibirapuera"],
      likedYou: true,
      ring: "var(--sage)",
      avatar: AVATAR_RAFAEL,
      photo: "assets/img/rafael.jpg",
      tint: "linear-gradient(160deg,#dae35a 0%,#c799c8 58%,#302437 100%)"
    },
    luiza: {
      id: "luiza",
      name: "Luiza",
      age: 29,
      distance: "4,1 km",
      area: "Sumaré",
      compatibility: 74,
      bio: "Dança e natação. Quero voltar a treinar em grupo sem sentir que estou atrasada.",
      activities: ["danca", "natacao"],
      level: "Iniciante",
      groups: [],
      likedYou: true,
      ring: "var(--plum)",
      avatar: AVATAR_LUIZA,
      photo: "assets/img/luiza.jpg",
      tint: "linear-gradient(160deg,#f77cc5 0%,#8f6f92 55%,#302437 100%)"
    },
    bruna: {
      id: "bruna",
      name: "Bruna",
      age: 33,
      distance: "0,9 km",
      area: "Pinheiros",
      compatibility: 71,
      bio: "Corro aos sábados no Ibirapuera e puxo o grupo das 6h. Ritmo leve, conversa em dia.",
      activities: ["corrida"],
      level: "Avançada",
      groups: ["corrida-6h"],
      ring: "var(--vermilion)",
      avatar: AVATAR_BRUNA,
      photo: "assets/img/bruna.jpg",
      tint: "linear-gradient(160deg,#f57335 0%,#dae35a 50%,#302437 100%)"
    },
    vem: {
      id: "vem",
      name: "Vem",
      age: "",
      distance: "Seu guia",
      area: "Sempre por perto",
      compatibility: 100,
      bio: "Oi! Eu sou o Vem, o guia do app. Vou te mostrar como conhecer gente para treinar.",
      activities: ["corrida"],
      level: "Guia",
      groups: [],
      likedYou: true,
      guide: true,
      ring: "var(--vermilion)",
      avatar: "assets/img/logo.svg",
      photo: "assets/img/logo.svg",
      tint: "linear-gradient(160deg,#f57335 0%,#f77cc5 55%,#302437 100%)"
    }
  };

  var events = [
    {
      id: "evento-yoga",
      title: "Yoga ao pôr do sol",
      activity: "yoga",
      emoji: "🧘",
      place: "Parque Villa-Lobos",
      when: "Qui · 18h30",
      long: "quinta, 18h30",
      duration: "50 min",
      image: "assets/img/evento-yoga.jpg",
      confirmed: ["luiza", "camila", "bruna"],
      group: "yoga-ibirapuera"
    },
    {
      id: "evento-corrida",
      title: "Corrida no Parque",
      activity: "corrida",
      emoji: "🏃",
      place: "Lago do Ibirapuera · 4 km",
      when: "Sáb · 06h30",
      long: "sábado, 6h30",
      duration: "4 km",
      image: "assets/img/evento-corrida-no-parque.jpg",
      confirmed: ["bruna", "rafael", "marina", "ana"],
      group: "corrida-6h"
    },
    {
      id: "evento-forca",
      title: "Força para iniciantes",
      activity: "musculacao",
      emoji: "🏋️",
      place: "Academia Vem · Pinheiros",
      when: "Ter · 19h",
      long: "terça, 19h",
      duration: "45 min",
      image: "assets/img/cover-gym.svg",
      confirmed: ["rafael", "camila"],
      group: "forca-pinheiros"
    },
    {
      id: "evento-natacao",
      title: "Natação livre, sem cronômetro",
      activity: "natacao",
      emoji: "🏊",
      place: "Piscina do Clube",
      when: "Amanhã · 06h30",
      long: "amanhã, 6h30",
      duration: "40 min",
      image: "assets/img/cover-swim.svg",
      confirmed: ["luiza", "camila"],
      group: null
    }
  ];

  var groups = [
    {
      id: "yoga-ibirapuera",
      name: "Yoga ao pôr do sol — Ibirapuera",
      activity: "yoga",
      emoji: "🧘",
      detail: "18 membros · sábados, 9h",
      place: "Parque Ibirapuera",
      members: ["marina", "rafael"],
      eventId: "evento-yoga",
      tint: "circle--sage"
    },
    {
      id: "corrida-6h",
      name: "Corrida às 6h",
      activity: "corrida",
      emoji: "🏃",
      detail: "24 membros · Ibirapuera",
      place: "Portão 7 do Ibirapuera",
      members: ["bruna", "marina", "ana"],
      eventId: "evento-corrida",
      tint: "circle--vermilion"
    },
    {
      id: "forca-pinheiros",
      name: "Força sem julgamento",
      activity: "musculacao",
      emoji: "🏋️",
      detail: "31 membros · Pinheiros",
      place: "Academia Vem",
      members: ["camila"],
      eventId: "evento-forca",
      tint: "circle--amber"
    }
  ];

  var data = {
    avatar: AVATAR,
    avatar2: AVATAR_2,
    people: people,
    activities: activities,
    broadTags: broadTags,
    broadPrimary: broadPrimary,
    suggestedActivities: suggestedActivities,
    events: events,
    groups: groups,

    /* O perfil testado começa vazio: nome, foto, matches e histórico vêm do uso. */
    user: {
      firstName: "",
      name: "",
      avatar: "",
      handle: "",
      email: "",
      level: 1,
      levelLabel: "Começando",
      followers: "0",
      following: "0",
      friends: "0",
      bio: "Seu perfil começa vazio. Preencha no cadastro e edite quando quiser.",
      tags: [],
      goal: ""
    },

    matches: [people.ana, people.marina, people.camila, people.rafael, people.luiza, people.bruna],

    /* Jornadas adaptativas — a escolha da tela 05 define o card da Home.
       A landing depois do onboarding é sempre a Home (tela 10). */
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
      },
      teacher: {
        label: "Educador físico",
        short: "Professor",
        start: "21",
        card: {
          badge: "Sua turma",
          title: "Seu CREF está em análise",
          text: "Enquanto a documentação é conferida, você já pode conhecer os <strong>grupos e eventos</strong> da sua região.",
          meta: ["CREF", "em análise", "grupos"],
          cta: "Ver grupos",
          target: "14"
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
