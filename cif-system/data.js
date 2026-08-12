// ============================================
// DADOS COMPLETOS DA CIF - Classificação Internacional de Funcionalidade
// Versão: OMS 2001 (com estrutura hierárquica)
// ============================================

const CIF_DADOS = {
    // ========== COMPONENTE B - FUNÇÕES DO CORPO ==========
    b: {
        nome: 'Funções do Corpo',
        capitulos: [
            {
                codigo: 'b1',
                nome: 'Funções Mentais',
                definicao: 'Funções do cérebro, incluindo aspectos globais e específicos.',
                filhos: [
                    { codigo: 'b110', nome: 'Funções da Consciência', definicao: 'Funções gerais de estado de consciência.' },
                    { codigo: 'b114', nome: 'Funções da Orientação', definicao: 'Funções de consciência sobre si mesmo, tempo e lugar.' },
                    { codigo: 'b117', nome: 'Funções Intelectuais', definicao: 'Funções mentais gerais para raciocínio, resolução de problemas e abstração.' },
                    { codigo: 'b130', nome: 'Funções da Energia e Impulso', definicao: 'Funções para iniciar, sustentar e finalizar atividades.' },
                    { codigo: 'b140', nome: 'Funções da Atenção', definicao: 'Funções para focar e manter a atenção.' },
                    { codigo: 'b144', nome: 'Funções da Memória', definicao: 'Funções para registrar, armazenar e recuperar informações.' },
                    { codigo: 'b147', nome: 'Funções Psicomotoras', definicao: 'Funções para controlar movimentos motores.' },
                    { codigo: 'b152', nome: 'Funções Emocionais', definicao: 'Funções para processar e regular emoções.' }
                ]
            },
            {
                codigo: 'b2',
                nome: 'Funções Sensoriais e Dor',
                definicao: 'Funções dos sentidos e percepção de dor.',
                filhos: [
                    { codigo: 'b210', nome: 'Funções da Visão', definicao: 'Funções para percepção visual.' },
                    { codigo: 'b230', nome: 'Funções da Audição', definicao: 'Funções para percepção auditiva.' },
                    { codigo: 'b240', nome: 'Sensações Associadas à Audição e ao Equilíbrio', definicao: 'Sensações como tontura e vertigem.' },
                    { codigo: 'b250', nome: 'Funções do Paladar', definicao: 'Funções para percepção de sabores.' },
                    { codigo: 'b260', nome: 'Funções do Olfato', definicao: 'Funções para percepção de odores.' },
                    { codigo: 'b270', nome: 'Funções Sensoriais Associadas à Temperatura e Outros Estímulos', definicao: 'Percepção de temperatura, pressão e tato.' },
                    { codigo: 'b280', nome: 'Sensação de Dor', definicao: 'Sensação de desconforto ou dor.' }
                ]
            },
            {
                codigo: 'b3',
                nome: 'Funções da Voz e da Fala',
                definicao: 'Funções para produção de sons e fala.',
                filhos: [
                    { codigo: 'b310', nome: 'Funções da Voz', definicao: 'Produção de sons vocais.' },
                    { codigo: 'b320', nome: 'Funções da Articulação', definicao: 'Produção de sons da fala.' },
                    { codigo: 'b330', nome: 'Funções da Fluência e do Ritmo da Fala', definicao: 'Fluência e ritmo da fala.' }
                ]
            },
            {
                codigo: 'b4',
                nome: 'Funções dos Sistemas Cardiovascular, Hematológico, Imunológico e Respiratório',
                definicao: 'Funções do coração, sangue, imunidade e respiração.',
                filhos: [
                    { codigo: 'b410', nome: 'Funções do Coração', definicao: 'Bombeamento de sangue pelo coração.' },
                    { codigo: 'b420', nome: 'Funções da Pressão Arterial', definicao: 'Manutenção da pressão arterial.' },
                    { codigo: 'b430', nome: 'Funções do Sistema Hematológico', definicao: 'Produção e função das células sanguíneas.' },
                    { codigo: 'b440', nome: 'Funções do Sistema Respiratório', definicao: 'Troca de gases pela respiração.' },
                    { codigo: 'b450', nome: 'Funções do Sistema Imunológico', definicao: 'Resposta imunológica do corpo.' }
                ]
            },
            {
                codigo: 'b5',
                nome: 'Funções dos Sistemas Digestivo, Metabólico e Endócrino',
                definicao: 'Funções digestão, metabolismo e hormônios.',
                filhos: [
                    { codigo: 'b510', nome: 'Funções de Ingestão', definicao: 'Atos de comer e beber.' },
                    { codigo: 'b515', nome: 'Funções de Digestão', definicao: 'Processamento de alimentos no sistema digestivo.' },
                    { codigo: 'b520', nome: 'Funções de Absorção', definicao: 'Absorção de nutrientes.' },
                    { codigo: 'b530', nome: 'Funções do Metabolismo', definicao: 'Processos metabólicos do corpo.' }
                ]
            },
            {
                codigo: 'b6',
                nome: 'Funções Geniturinárias e Reprodutivas',
                definicao: 'Funções dos sistemas urinário, genital e reprodutivo.',
                filhos: [
                    { codigo: 'b610', nome: 'Funções Urinárias', definicao: 'Produção e eliminação de urina.' },
                    { codigo: 'b620', nome: 'Funções Genitais', definicao: 'Funções dos órgãos genitais.' },
                    { codigo: 'b630', nome: 'Funções Reprodutivas', definicao: 'Funções relacionadas à reprodução.' }
                ]
            },
            {
                codigo: 'b7',
                nome: 'Funções Neuromusculoesqueléticas e Relacionadas ao Movimento',
                definicao: 'Funções dos músculos, ossos e movimento.',
                filhos: [
                    { codigo: 'b710', nome: 'Funções de Mobilidade Articular', definicao: 'Amplitude de movimento das articulações.' },
                    { codigo: 'b715', nome: 'Funções de Estabilidade Articular', definicao: 'Estabilidade das articulações.' },
                    { codigo: 'b720', nome: 'Funções de Mobilidade Óssea', definicao: 'Movimento dos ossos.' },
                    { codigo: 'b730', nome: 'Funções de Força Muscular', definicao: 'Força gerada pelos músculos.' },
                    { codigo: 'b735', nome: 'Funções de Tônus Muscular', definicao: 'Tensão muscular.' },
                    { codigo: 'b740', nome: 'Funções de Resistência Muscular', definicao: 'Resistência muscular ao esforço.' }
                ]
            },
            {
                codigo: 'b8',
                nome: 'Funções da Pele e Estruturas Relacionadas',
                definicao: 'Funções da pele, unhas e cabelos.',
                filhos: [
                    { codigo: 'b810', nome: 'Funções de Proteção da Pele', definicao: 'Proteção contra agentes externos.' },
                    { codigo: 'b820', nome: 'Funções de Reparo da Pele', definicao: 'Capacidade de reparo da pele.' },
                    { codigo: 'b830', nome: 'Funções das Unhas', definicao: 'Crescimento e função das unhas.' }
                ]
            }
        ]
    },

    // ========== COMPONENTE S - ESTRUTURAS DO CORPO ==========
    s: {
        nome: 'Estruturas do Corpo',
        capitulos: [
            {
                codigo: 's1',
                nome: 'Estruturas do Sistema Nervoso',
                definicao: 'Estruturas do cérebro, medula espinhal e nervos.',
                filhos: [
                    { codigo: 's110', nome: 'Estrutura do Cérebro', definicao: 'Estrutura anatômica do cérebro.' },
                    { codigo: 's120', nome: 'Estrutura da Medula Espinhal', definicao: 'Estrutura da medula espinhal.' },
                    { codigo: 's130', nome: 'Estrutura dos Nervos Periféricos', definicao: 'Nervos fora do sistema nervoso central.' }
                ]
            },
            {
                codigo: 's2',
                nome: 'Olho, Ouvido e Estruturas Relacionadas',
                definicao: 'Estruturas dos olhos, ouvidos e anexos.',
                filhos: [
                    { codigo: 's210', nome: 'Estrutura do Olho', definicao: 'Estrutura anatômica do olho.' },
                    { codigo: 's220', nome: 'Estrutura do Ouvido', definicao: 'Estrutura anatômica do ouvido.' },
                    { codigo: 's230', nome: 'Estruturas Relacionadas ao Olho e Ouvido', definicao: 'Anexos oculares e auditivos.' }
                ]
            },
            {
                codigo: 's3',
                nome: 'Estruturas Envolvidas na Voz e na Fala',
                definicao: 'Estruturas da laringe, faringe e boca.',
                filhos: [
                    { codigo: 's310', nome: 'Estrutura da Laringe', definicao: 'Estrutura anatômica da laringe.' },
                    { codigo: 's320', nome: 'Estrutura da Faringe', definicao: 'Estrutura anatômica da faringe.' },
                    { codigo: 's330', nome: 'Estrutura da Boca', definicao: 'Estrutura anatômica da boca.' }
                ]
            },
            {
                codigo: 's4',
                nome: 'Estruturas dos Sistemas Cardiovascular, Imunológico e Respiratório',
                definicao: 'Estruturas do coração, vasos, sistema imunológico e pulmões.',
                filhos: [
                    { codigo: 's410', nome: 'Estrutura do Coração', definicao: 'Estrutura anatômica do coração.' },
                    { codigo: 's420', nome: 'Estrutura dos Vasos Sanguíneos', definicao: 'Artérias, veias e capilares.' },
                    { codigo: 's430', nome: 'Estrutura do Sistema Imunológico', definicao: 'Órgãos e tecidos do sistema imunológico.' },
                    { codigo: 's440', nome: 'Estrutura do Sistema Respiratório', definicao: 'Pulmões e vias respiratórias.' }
                ]
            },
            {
                codigo: 's5',
                nome: 'Estruturas Relacionadas aos Sistemas Digestivo, Metabólico e Endócrino',
                definicao: 'Estruturas do trato digestivo, glândulas e órgãos metabólicos.',
                filhos: [
                    { codigo: 's510', nome: 'Estrutura do Sistema Digestivo', definicao: 'Boca, esôfago, estômago, intestinos.' },
                    { codigo: 's520', nome: 'Estrutura do Sistema Metabólico', definicao: 'Fígado, pâncreas e órgãos metabólicos.' },
                    { codigo: 's530', nome: 'Estrutura do Sistema Endócrino', definicao: 'Glândulas endócrinas.' }
                ]
            },
            {
                codigo: 's6',
                nome: 'Estruturas Relacionadas aos Sistemas Geniturinário e Reprodutivo',
                definicao: 'Estruturas dos sistemas urinário, genital e reprodutivo.',
                filhos: [
                    { codigo: 's610', nome: 'Estrutura do Sistema Urinário', definicao: 'Rins, ureteres, bexiga.' },
                    { codigo: 's620', nome: 'Estrutura do Sistema Genital', definicao: 'Órgãos genitais internos e externos.' },
                    { codigo: 's630', nome: 'Estrutura do Sistema Reprodutivo', definicao: 'Órgãos reprodutivos.' }
                ]
            },
            {
                codigo: 's7',
                nome: 'Estruturas Relacionadas ao Movimento',
                definicao: 'Estruturas dos ossos, articulações e músculos.',
                filhos: [
                    { codigo: 's710', nome: 'Estrutura do Esqueleto', definicao: 'Ossos e cartilagens.' },
                    { codigo: 's720', nome: 'Estrutura das Articulações', definicao: 'Articulações e ligamentos.' },
                    { codigo: 's730', nome: 'Estrutura dos Músculos', definicao: 'Músculos e tendões.' }
                ]
            },
            {
                codigo: 's8',
                nome: 'Pele e Estruturas Relacionadas',
                definicao: 'Estruturas da pele, unhas e cabelos.',
                filhos: [
                    { codigo: 's810', nome: 'Estrutura da Pele', definicao: 'Camadas da pele.' },
                    { codigo: 's820', nome: 'Estrutura das Unhas', definicao: 'Unhas das mãos e pés.' },
                    { codigo: 's830', nome: 'Estrutura dos Cabelos', definicao: 'Cabelos e pelos.' }
                ]
            }
        ]
    },

    // ========== COMPONENTE D - ATIVIDADES E PARTICIPAÇÃO ==========
    d: {
        nome: 'Atividades e Participação',
        capitulos: [
            {
                codigo: 'd1',
                nome: 'Aprendizagem e Aplicação do Conhecimento',
                definicao: 'Capacidades para aprender e usar conhecimento.',
                filhos: [
                    { codigo: 'd110', nome: 'Aprender a Ler', definicao: 'Desenvolver a capacidade de ler.' },
                    { codigo: 'd120', nome: 'Aprender a Escrever', definicao: 'Desenvolver a capacidade de escrever.' },
                    { codigo: 'd130', nome: 'Aprender a Calcular', definicao: 'Desenvolver habilidades matemáticas.' },
                    { codigo: 'd140', nome: 'Aplicar Conhecimento', definicao: 'Usar conhecimento em situações práticas.' }
                ]
            },
            {
                codigo: 'd2',
                nome: 'Tarefas e Demandas Gerais',
                definicao: 'Capacidades para realizar tarefas diárias.',
                filhos: [
                    { codigo: 'd210', nome: 'Realizar Tarefa Única', definicao: 'Executar uma tarefa simples.' },
                    { codigo: 'd220', nome: 'Realizar Tarefas Múltiplas', definicao: 'Executar várias tarefas simultaneamente.' },
                    { codigo: 'd230', nome: 'Gerenciar Demandas', definicao: 'Organizar e priorizar tarefas.' }
                ]
            },
            {
                codigo: 'd3',
                nome: 'Comunicação',
                definicao: 'Capacidades para se comunicar.',
                filhos: [
                    { codigo: 'd310', nome: 'Comunicação Verbal', definicao: 'Falar e entender a fala.' },
                    { codigo: 'd320', nome: 'Comunicação Não Verbal', definicao: 'Gestos, expressões faciais.' },
                    { codigo: 'd330', nome: 'Comunicação Escrita', definicao: 'Ler e escrever.' }
                ]
            },
            {
                codigo: 'd4',
                nome: 'Mobilidade',
                definicao: 'Capacidades para se movimentar.',
                filhos: [
                    { codigo: 'd410', nome: 'Mudar Posição', definicao: 'Sentar, levantar, deitar.' },
                    { codigo: 'd420', nome: 'Transferir-se', definicao: 'Mover-se entre superfícies.' },
                    { codigo: 'd430', nome: 'Levantar e Carregar', definicao: 'Erguer e transportar objetos.' },
                    { codigo: 'd440', nome: 'Andar', definicao: 'Locomover-se caminhando.' },
                    { codigo: 'd450', nome: 'Subir e Descer', definicao: 'Subir e descer escadas.' },
                    { codigo: 'd460', nome: 'Mover-se de Forma Independente', definicao: 'Locomover-se sem ajuda.' }
                ]
            },
            {
                codigo: 'd5',
                nome: 'Cuidado Pessoal (Autocuidado)',
                definicao: 'Capacidades para cuidar de si mesmo.',
                filhos: [
                    { codigo: 'd510', nome: 'Higiene Pessoal', definicao: 'Banho, escovação, cuidados com a pele.' },
                    { codigo: 'd520', nome: 'Vestir-se', definicao: 'Vestir e despir-se.' },
                    { codigo: 'd530', nome: 'Alimentar-se', definicao: 'Comer e beber.' },
                    { codigo: 'd540', nome: 'Cuidar da Saúde', definicao: 'Tomar medicamentos, seguir tratamentos.' }
                ]
            },
            {
                codigo: 'd6',
                nome: 'Vida Doméstica',
                definicao: 'Capacidades para atividades domésticas.',
                filhos: [
                    { codigo: 'd610', nome: 'Cuidar da Casa', definicao: 'Limpeza, organização, manutenção.' },
                    { codigo: 'd620', nome: 'Preparar Refeições', definicao: 'Cozinhar e preparar alimentos.' },
                    { codigo: 'd630', nome: 'Cuidar de Objetos', definicao: 'Cuidar de roupas, utensílios.' }
                ]
            },
            {
                codigo: 'd7',
                nome: 'Interações e Relacionamentos Interpessoais',
                definicao: 'Capacidades para interagir e se relacionar.',
                filhos: [
                    { codigo: 'd710', nome: 'Interações Familiares', definicao: 'Relacionamentos com familiares.' },
                    { codigo: 'd720', nome: 'Interações Sociais', definicao: 'Amizades e relações sociais.' },
                    { codigo: 'd730', nome: 'Interações Formais', definicao: 'Relacionamentos profissionais.' }
                ]
            },
            {
                codigo: 'd8',
                nome: 'Áreas Principais da Vida',
                definicao: 'Educação, trabalho, vida econômica.',
                filhos: [
                    { codigo: 'd810', nome: 'Educação Formal', definicao: 'Frequentar escola, cursos.' },
                    { codigo: 'd820', nome: 'Trabalho Remunerado', definicao: 'Atividades profissionais.' },
                    { codigo: 'd830', nome: 'Vida Econômica', definicao: 'Gerenciar finanças, compras.' }
                ]
            },
            {
                codigo: 'd9',
                nome: 'Vida Comunitária, Social e Cívica',
                definicao: 'Participação comunitária, lazer, religião.',
                filhos: [
                    { codigo: 'd910', nome: 'Participação Comunitária', definicao: 'Envolvimento na comunidade.' },
                    { codigo: 'd920', nome: 'Lazer e Recreação', definicao: 'Atividades de lazer, esportes.' },
                    { codigo: 'd930', nome: 'Participação Religiosa', definicao: 'Atividades religiosas e espirituais.' }
                ]
            }
        ]
    },

    // ========== COMPONENTE E - FATORES AMBIENTAIS ==========
    e: {
        nome: 'Fatores Ambientais',
        capitulos: [
            {
                codigo: 'e1',
                nome: 'Produtos e Tecnologia',
                definicao: 'Produtos, dispositivos e tecnologias.',
                filhos: [
                    { codigo: 'e110', nome: 'Produtos para Uso Pessoal', definicao: 'Roupas, calçados, óculos.' },
                    { codigo: 'e115', nome: 'Tecnologias de Comunicação', definicao: 'Telefones, computadores, próteses.' },
                    { codigo: 'e120', nome: 'Produtos para Mobilidade', definicao: 'Cadeiras de rodas, muletas.' },
                    { codigo: 'e125', nome: 'Produtos para Cuidados Pessoais', definicao: 'Produtos de higiene, saúde.' }
                ]
            },
            {
                codigo: 'e2',
                nome: 'Ambiente Natural e Mudanças Ambientais Feitas pelo Ser Humano',
                definicao: 'Ambiente físico e construído.',
                filhos: [
                    { codigo: 'e210', nome: 'Ambiente Natural', definicao: 'Clima, geografia, recursos naturais.' },
                    { codigo: 'e220', nome: 'Ambiente Construído', definicao: 'Edifícios, ruas, infraestrutura.' },
                    { codigo: 'e230', nome: 'Tecnologias de Infraestrutura', definicao: 'Água, energia, transporte.' }
                ]
            },
            {
                codigo: 'e3',
                nome: 'Apoio e Relacionamentos',
                definicao: 'Suporte social e relacionamentos.',
                filhos: [
                    { codigo: 'e310', nome: 'Suporte Familiar', definicao: 'Apoio de familiares.' },
                    { codigo: 'e320', nome: 'Suporte de Amigos', definicao: 'Apoio de amigos e colegas.' },
                    { codigo: 'e330', nome: 'Suporte Profissional', definicao: 'Apoio de profissionais de saúde.' }
                ]
            },
            {
                codigo: 'e4',
                nome: 'Atitudes',
                definicao: 'Atitudes sociais e individuais.',
                filhos: [
                    { codigo: 'e410', nome: 'Atitudes Familiares', definicao: 'Atitudes de familiares.' },
                    { codigo: 'e420', nome: 'Atitudes Sociais', definicao: 'Preconceito, estigma, aceitação.' },
                    { codigo: 'e430', nome: 'Atitudes Profissionais', definicao: 'Atitudes de profissionais de saúde.' }
                ]
            },
            {
                codigo: 'e5',
                nome: 'Serviços, Sistemas e Políticas',
                definicao: 'Serviços públicos, sistemas e políticas.',
                filhos: [
                    { codigo: 'e510', nome: 'Serviços de Saúde', definicao: 'Hospitais, clínicas, atendimento.' },
                    { codigo: 'e520', nome: 'Serviços Sociais', definicao: 'Assistência social, previdência.' },
                    { codigo: 'e530', nome: 'Políticas Públicas', definicao: 'Leis, regulamentos, direitos.' }
                ]
            }
        ]
    }
};

// Função para obter todos os dados de um componente
function getComponentData(componente) {
    return CIF_DADOS[componente] || null;
}

// Função para buscar por termo
function buscarNoCIF(termo) {
    const resultados = [];
    const termoLower = termo.toLowerCase();

    for (const [comp, dados] of Object.entries(CIF_DADOS)) {
        for (const cap of dados.capitulos) {
            // Busca no capítulo
            if (cap.codigo.toLowerCase().includes(termoLower) || 
                cap.nome.toLowerCase().includes(termoLower)) {
                resultados.push({
                    ...cap,
                    componente: comp,
                    tipo: 'capitulo'
                });
            }
            // Busca nos filhos
            if (cap.filhos) {
                for (const filho of cap.filhos) {
                    if (filho.codigo.toLowerCase().includes(termoLower) || 
                        filho.nome.toLowerCase().includes(termoLower)) {
                        resultados.push({
                            ...filho,
                            componente: comp,
                            pai: cap.codigo,
                            paiNome: cap.nome,
                            tipo: 'categoria'
                        });
                    }
                }
            }
        }
    }

    return resultados;
}

// Contar total de itens
function contarItens() {
    let total = 0;
    for (const [comp, dados] of Object.entries(CIF_DADOS)) {
        total += dados.capitulos.length;
        for (const cap of dados.capitulos) {
            if (cap.filhos) total += cap.filhos.length;
        }
    }
    return total;
}

// Contar níveis
function contarNiveis() {
    let niveis = new Set();
    for (const [comp, dados] of Object.entries(CIF_DADOS)) {
        for (const cap of dados.capitulos) {
            niveis.add(1);
            if (cap.filhos) {
                for (const filho of cap.filhos) {
                    niveis.add(2);
                    // Se tiver mais níveis, adicionar
                    if (filho.filhos) niveis.add(3);
                }
            }
        }
    }
    return niveis.size;
}