// ============================================
// APP.JS - Lógica completa do sistema CIAP-2
// ============================================

let capituloAtual = 'A';
let rubricaSelecionada = null;

// Nomes dos componentes
const NOMES_COMPONENTES = {
    1: 'Sinais e Sintomas',
    2: 'Procedimentos Diagnósticos e Preventivos',
    3: 'Medicações, Tratamentos e Procedimentos',
    4: 'Resultados de Exames',
    5: 'Procedimentos Administrativos',
    6: 'Encaminhamentos e Outras Razões de Consulta',
    7: 'Doenças e Problemas de Saúde'
};

// Cores dos componentes
const CORES_COMPONENTES = {
    1: '#e74c3c',  // Vermelho - Sinais/Sintomas
    2: '#3498db',  // Azul - Procedimentos
    3: '#2ecc71',  // Verde - Tratamentos
    4: '#f39c12',  // Laranja - Exames
    5: '#9b59b6',  // Roxo - Administrativo
    6: '#1abc9c',  // Turquesa - Encaminhamentos
    7: '#e67e22'   // Laranja escuro - Doenças
};

// ===== CARREGAR CAPÍTULO =====
function carregarCapitulo(codigo, botao) {
    capituloAtual = codigo;

    // Atualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (botao) botao.classList.add('active');

    // Atualizar info
    const dados = getCapituloData(codigo);
    if (dados) {
        const total = Object.keys(dados.rubricas).length;
        document.getElementById('capituloNome').textContent = dados.nome;
        document.getElementById('capituloDescricao').textContent = dados.descricao || '';
        document.getElementById('totalItens').textContent = `${total} rubricas`;
    }

    // Renderizar
    renderizarCapitulo(codigo);
}

// ===== RENDERIZAR CAPÍTULO =====
function renderizarCapitulo(codigo) {
    const dados = getCapituloData(codigo);
    const content = document.getElementById('content');

    if (!dados) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>Capítulo não encontrado.</p>
            </div>
        `;
        return;
    }

    // Agrupar rubricas por componente
    const grupos = {};
    for (const [codRubrica, rubrica] of Object.entries(dados.rubricas)) {
        const comp = rubrica.componente;
        if (!grupos[comp]) grupos[comp] = [];
        grupos[comp].push({ codigo: codRubrica, ...rubrica });
    }

    // Ordenar componentes
    const compsOrdenados = Object.keys(grupos).sort((a, b) => a - b);

    let html = `
        <div class="capitulo-header">
            <h2><span class="capitulo-badge">${codigo}</span> ${dados.nome}</h2>
            ${dados.descricao ? `<p class="capitulo-descricao">${dados.descricao}</p>` : ''}
        </div>
        <div class="legenda">
            <span class="legenda-titulo"><i class="fas fa-palette"></i> Componentes:</span>
    `;

    for (const comp of compsOrdenados) {
        const cor = CORES_COMPONENTES[comp] || '#95a5a6';
        html += `
            <span class="legenda-item">
                <span class="legenda-cor" style="background:${cor}"></span>
                ${NOMES_COMPONENTES[comp] || comp}
            </span>
        `;
    }

    html += `</div>`;

    // Renderizar cada grupo
    for (const comp of compsOrdenados) {
        const rubricas = grupos[comp];
        const cor = CORES_COMPONENTES[comp] || '#95a5a6';

        html += `
            <div class="componente-grupo" style="border-left-color: ${cor}">
                <div class="componente-header" style="background: ${cor}20">
                    <span class="componente-numero">${comp}</span>
                    <span class="componente-nome">${NOMES_COMPONENTES[comp] || comp}</span>
                    <span class="componente-total">${rubricas.length} rubricas</span>
                </div>
                <div class="rubricas-grid">
        `;

        // Ordenar rubricas por código
        rubricas.sort((a, b) => a.codigo.localeCompare(b.codigo));

        for (const rubrica of rubricas) {
            html += `
                <div class="rubrica-item" onclick="mostrarDetalhes('${codigo}', '${rubrica.codigo}')">
                    <span class="rubrica-codigo">${rubrica.codigo}</span>
                    <span class="rubrica-nome">${rubrica.nome}</span>
                    <button class="btn-detalhes" title="Ver detalhes">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `;
        }

        html += `</div></div>`;
    }

    content.innerHTML = html;
    atualizarStats(codigo);
}

// ===== MOSTRAR DETALHES (MODAL) =====
function mostrarDetalhes(capCodigo, rubCodigo) {
    const dados = getCapituloData(capCodigo);
    if (!dados) return;

    const rubrica = dados.rubricas[rubCodigo];
    if (!rubrica) return;

    const modal = document.getElementById('detalhesModal');
    const body = document.getElementById('modalBody');

    const cor = CORES_COMPONENTES[rubrica.componente] || '#95a5a6';

    body.innerHTML = `
        <div class="modal-body">
            <div class="modal-header" style="border-bottom: 3px solid ${cor}">
                <div class="modal-codigo">${rubCodigo}</div>
                <h3>${rubrica.nome}</h3>
            </div>
            <div class="detail-item">
                <div class="detail-label">Capítulo</div>
                <div class="detail-value"><strong>${capCodigo}</strong> - ${dados.nome}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Componente</div>
                <div class="detail-value">
                    <span class="componente-tag" style="background:${cor}">
                        ${rubrica.componente} - ${NOMES_COMPONENTES[rubrica.componente] || rubrica.componente}
                    </span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Código completo</div>
                <div class="detail-value code">${capCodigo}${rubCodigo}</div>
            </div>
            <div class="detail-item" style="border-bottom: none;">
                <div class="detail-label">Uso no e-SUS</div>
                <div class="detail-value" style="font-size: 13px; color: #555;">
                    <i class="fas fa-check-circle" style="color: #2ecc71;"></i> 
                    Classificação oficial para registro de atendimentos na Atenção Primária
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// ===== FECHAR MODAL =====
function fecharModal() {
    document.getElementById('detalhesModal').style.display = 'none';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fecharModal();
});

document.getElementById('detalhesModal').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
});

// ===== BUSCAR =====
function buscarCIAP2() {
    const termo = document.getElementById('searchInput').value.trim();
    const content = document.getElementById('content');

    if (!termo) {
        carregarCapitulo(capituloAtual, document.querySelector('.tab-btn.active'));
        return;
    }

    const resultados = buscarNaCIAP2(termo);

    if (resultados.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado para "<strong>${termo}</strong>"</p>
                <p style="font-size: 13px; color: #95a5a6; margin-top: 8px;">
                    Tente buscar por código (ex: A01, R05, K76) ou por nome
                </p>
            </div>
        `;
        document.getElementById('capituloNome').textContent = '🔍 Resultados da Busca';
        document.getElementById('totalItens').textContent = `${resultados.length} resultados`;
        document.getElementById('capituloDescricao').textContent = '';
        return;
    }

    // Agrupar por capítulo
    const agrupados = {};
    for (const r of resultados) {
        if (!agrupados[r.capitulo]) agrupados[r.capitulo] = [];
        agrupados[r.capitulo].push(r);
    }

    let html = `
        <div class="busca-header">
            <h3><i class="fas fa-search" style="color: #2e86c1;"></i> Resultados para "<strong>${termo}</strong>"</h3>
            <p style="color: #7f8c8d; font-size: 14px;">${resultados.length} rubrica(s) encontrada(s)</p>
        </div>
    `;

    for (const [cap, itens] of Object.entries(agrupados)) {
        const capDados = getCapituloData(cap);
        html += `
            <div class="componente-grupo" style="border-left-color: #2e86c1;">
                <div class="componente-header" style="background: #2e86c120;">
                    <span class="componente-nome">${cap} - ${capDados ? capDados.nome : cap}</span>
                    <span class="componente-total">${itens.length} rubricas</span>
                </div>
                <div class="rubricas-grid">
        `;

        itens.forEach(r => {
            const cor = CORES_COMPONENTES[r.componente] || '#95a5a6';
            html += `
                <div class="rubrica-item" onclick="mostrarDetalhes('${r.capitulo}', '${r.codigo}')">
                    <span class="rubrica-codigo">${r.codigo}</span>
                    <span class="rubrica-nome">${r.nome}</span>
                    <span class="rubrica-comp" style="background:${cor}20; color:${cor}; font-size: 10px; padding: 2px 8px; border-radius: 10px;">
                        ${r.componente}
                    </span>
                    <button class="btn-detalhes" title="Ver detalhes">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `;
        });

        html += `</div></div>`;
    }

    content.innerHTML = html;
    document.getElementById('capituloNome').textContent = '🔍 Resultados da Busca';
    document.getElementById('totalItens').textContent = `${resultados.length} resultados`;
    document.getElementById('capituloDescricao').textContent = '';
}

// ===== LIMPAR BUSCA =====
function limparBusca() {
    document.getElementById('searchInput').value = '';
    carregarCapitulo(capituloAtual, document.querySelector('.tab-btn.active'));
}

// ===== ATUALIZAR STATS =====
function atualizarStats(codigo) {
    const dados = getCapituloData(codigo);
    if (!dados) return;

    const total = Object.keys(dados.rubricas).length;
    document.getElementById('totalRubricas').textContent = total;
    document.getElementById('totalCapitulos').textContent = Object.keys(CIAP2_DADOS).length;
    document.getElementById('ultimaAtualizacao').textContent = new Date().toLocaleTimeString('pt-BR');
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar total de capítulos
    document.getElementById('totalCapitulos').textContent = Object.keys(CIAP2_DADOS).length;
    // Carregar primeiro capítulo
    carregarCapitulo('A', document.querySelector('.tab-btn'));
});