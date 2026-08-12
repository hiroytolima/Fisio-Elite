// ============================================
// APP.JS - Lógica completa do sistema CIF
// ============================================

let componenteAtual = 'b';
let itemSelecionado = null;

// ===== CARREGAR COMPONENTE =====
function carregarComponente(componente, botao) {
    componenteAtual = componente;

    // Atualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (botao) botao.classList.add('active');

    // Atualizar info
    const dados = getComponentData(componente);
    if (dados) {
        document.getElementById('componenteNome').textContent = dados.nome;
        let total = 0;
        dados.capitulos.forEach(cap => {
            total += 1;
            if (cap.filhos) total += cap.filhos.length;
        });
        document.getElementById('totalItens').textContent = `${total} itens`;
    }

    // Renderizar
    renderizarArvore(componente);
}

// ===== RENDERIZAR ÁRVORE =====
function renderizarArvore(componente) {
    const dados = getComponentData(componente);
    const content = document.getElementById('content');

    if (!dados || !dados.capitulos || dados.capitulos.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>Nenhum dado encontrado para este componente.</p>
            </div>
        `;
        return;
    }

    let html = `<ul class="tree">`;

    dados.capitulos.forEach(cap => {
        html += renderizarItem(cap, 1, componente);
    });

    html += `</ul>`;
    content.innerHTML = html;

    // Adicionar eventos de clique
    document.querySelectorAll('.tree-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.closest('.btn-detalhes') || e.target.closest('.toggle')) return;
            const id = this.dataset.id;
            toggleFilhos(id);
        });
    });

    // Atualizar estatísticas
    atualizarStats(componente);
}

// ===== RENDERIZAR ITEM RECURSIVO =====
function renderizarItem(item, nivel, componente, paiCodigo = null) {
    const temFilhos = item.filhos && item.filhos.length > 0;
    const id = `${componente}_${item.codigo}`;

    let html = `<li>`;
    html += `
        <div class="tree-item" data-id="${id}" data-codigo="${item.codigo}">
            <span class="toggle ${temFilhos ? '' : 'invisible'}">
                ${temFilhos ? '<i class="fas fa-chevron-right"></i>' : '•'}
            </span>
            <span class="nivel-indicador nivel-${nivel}"></span>
            <span class="codigo">${item.codigo}</span>
            <span class="nome">${item.nome}</span>
            ${item.definicao ? `<span class="definicao">${item.definicao.substring(0, 80)}${item.definicao.length > 80 ? '...' : ''}</span>` : ''}
            <button class="btn-detalhes" onclick="event.stopPropagation(); mostrarDetalhes('${componente}', '${item.codigo}')" title="Ver detalhes">
                <i class="fas fa-info-circle"></i>
            </button>
        </div>
    `;

    if (temFilhos) {
        html += `<ul class="tree-children" data-pai="${id}" data-pai-codigo="${item.codigo}">`;
        item.filhos.forEach(filho => {
            // Se filho tiver filhos, passar nível 3
            if (filho.filhos && filho.filhos.length > 0) {
                html += renderizarItem(filho, nivel + 1, componente, item.codigo);
            } else {
                // Filho sem filhos (nível 2 ou 3)
                const filhoId = `${componente}_${filho.codigo}`;
                html += `
                    <li>
                        <div class="tree-item" data-id="${filhoId}" data-codigo="${filho.codigo}">
                            <span class="toggle invisible">•</span>
                            <span class="nivel-indicador nivel-${nivel + 1}"></span>
                            <span class="codigo">${filho.codigo}</span>
                            <span class="nome">${filho.nome}</span>
                            ${filho.definicao ? `<span class="definicao">${filho.definicao.substring(0, 60)}${filho.definicao.length > 60 ? '...' : ''}</span>` : ''}
                            <button class="btn-detalhes" onclick="event.stopPropagation(); mostrarDetalhes('${componente}', '${filho.codigo}')" title="Ver detalhes">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </li>
                `;
            }
        });
        html += `</ul>`;
    }

    html += `</li>`;
    return html;
}

// ===== TOGGLE FILHOS =====
function toggleFilhos(id) {
    const children = document.querySelector(`.tree-children[data-pai="${id}"]`);
    const toggle = document.querySelector(`.tree-item[data-id="${id}"] .toggle`);

    if (children) {
        children.classList.toggle('open');
        if (toggle) {
            toggle.classList.toggle('open');
            // Se abrir, carregar dados mais profundos se necessário
            if (children.classList.contains('open')) {
                // Verificar se precisa carregar mais níveis
                const paiCodigo = children.dataset.paiCodigo;
                if (paiCodigo) {
                    // Já temos os dados, apenas expandir
                }
            }
        }
    }
}

// ===== MOSTRAR DETALHES (MODAL) =====
function mostrarDetalhes(componente, codigo) {
    const dados = getComponentData(componente);
    let item = null;
    let pai = null;

    // Buscar o item
    for (const cap of dados.capitulos) {
        if (cap.codigo === codigo) {
            item = { ...cap, nivel: 'Capítulo' };
            break;
        }
        if (cap.filhos) {
            for (const filho of cap.filhos) {
                if (filho.codigo === codigo) {
                    item = { ...filho, nivel: 'Categoria' };
                    pai = cap;
                    break;
                }
                // Buscar em terceiro nível
                if (filho.filhos) {
                    for (const sub of filho.filhos) {
                        if (sub.codigo === codigo) {
                            item = { ...sub, nivel: 'Subcategoria' };
                            pai = cap;
                            break;
                        }
                    }
                }
            }
        }
    }

    if (!item) {
        alert('Item não encontrado!');
        return;
    }

    const modal = document.getElementById('detalhesModal');
    const body = document.getElementById('modalBody');

    body.innerHTML = `
        <div class="modal-body">
            <div class="detail-item">
                <div class="detail-label">Código</div>
                <div class="detail-value code">${item.codigo}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Nome</div>
                <div class="detail-value"><strong>${item.nome}</strong></div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Nível</div>
                <div class="detail-value">${item.nivel || 'Não especificado'}</div>
            </div>
            ${pai ? `
                <div class="detail-item">
                    <div class="detail-label">Capítulo</div>
                    <div class="detail-value">${pai.codigo} - ${pai.nome}</div>
                </div>
            ` : ''}
            ${item.definicao ? `
                <div class="detail-item">
                    <div class="detail-label">Definição</div>
                    <div class="detail-value">${item.definicao}</div>
                </div>
            ` : ''}
            ${item.exemplo ? `
                <div class="detail-item">
                    <div class="detail-label">Exemplo</div>
                    <div class="detail-value">${item.exemplo}</div>
                </div>
            ` : ''}
            <div class="detail-item">
                <div class="detail-label">Componente</div>
                <div class="detail-value">${getNomeComponente(componente)} (${componente.toUpperCase()})</div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// ===== FECHAR MODAL =====
function fecharModal() {
    document.getElementById('detalhesModal').style.display = 'none';
}

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fecharModal();
});

// Fechar modal clicando fora
document.getElementById('detalhesModal').addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
});

// ===== GET NOME COMPONENTE =====
function getNomeComponente(comp) {
    const nomes = {
        'b': 'Funções do Corpo',
        's': 'Estruturas do Corpo',
        'd': 'Atividades e Participação',
        'e': 'Fatores Ambientais'
    };
    return nomes[comp] || comp;
}

// ===== BUSCAR =====
function buscarCIF() {
    const termo = document.getElementById('searchInput').value.trim();
    const content = document.getElementById('content');

    if (!termo) {
        carregarComponente(componenteAtual, document.querySelector('.tab-btn.active'));
        return;
    }

    const resultados = buscarNoCIF(termo);

    if (resultados.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado para "<strong>${termo}</strong>"</p>
                <p style="font-size: 13px; color: #95a5a6; margin-top: 8px;">Tente buscar por código (ex: b1, d450) ou nome</p>
            </div>
        `;
        document.getElementById('componenteNome').textContent = 'Resultados da Busca';
        document.getElementById('totalItens').textContent = `${resultados.length} resultados`;
        return;
    }

    // Agrupar por componente
    const agrupados = {};
    resultados.forEach(item => {
        const comp = item.componente;
        if (!agrupados[comp]) agrupados[comp] = [];
        agrupados[comp].push(item);
    });

    let html = `<div style="margin-bottom: 15px;">`;
    html += `<h3><i class="fas fa-search" style="color: #2e86c1;"></i> Resultados para "<strong>${termo}</strong>"</h3>`;
    html += `<p style="color: #7f8c8d; font-size: 14px;">${resultados.length} item(ns) encontrado(s)</p>`;
    html += `</div>`;

    for (const [comp, itens] of Object.entries(agrupados)) {
        html += `<h4 style="color: #1a5276; margin: 20px 0 10px 0;">
            <i class="fas fa-folder"></i> ${getNomeComponente(comp)}
        </h4>`;
        html += `<ul class="tree">`;
        itens.forEach(item => {
            const tipoBadge = item.tipo === 'capitulo' ? '📁' : '📄';
            html += `
                <li>
                    <div class="tree-item" style="cursor: default;">
                        <span class="codigo">${item.codigo}</span>
                        <span class="nome">${item.nome}</span>
                        <span style="font-size: 11px; color: #95a5a6; background: #f0f2f5; padding: 2px 10px; border-radius: 12px;">
                            ${item.tipo === 'capitulo' ? 'Capítulo' : 'Categoria'}
                            ${item.paiNome ? ` › ${item.paiNome}` : ''}
                        </span>
                        <button class="btn-detalhes" onclick="mostrarDetalhes('${comp}', '${item.codigo}')" title="Ver detalhes">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </li>
            `;
        });
        html += `</ul>`;
    }

    content.innerHTML = html;
    document.getElementById('componenteNome').textContent = '🔍 Resultados da Busca';
    document.getElementById('totalItens').textContent = `${resultados.length} resultados`;
}

// ===== LIMPAR BUSCA =====
function limparBusca() {
    document.getElementById('searchInput').value = '';
    carregarComponente(componenteAtual, document.querySelector('.tab-btn.active'));
}

// ===== ATUALIZAR STATS =====
function atualizarStats(componente) {
    const dados = getComponentData(componente);
    if (!dados) return;

    let total = 0;
    let niveis = new Set();

    dados.capitulos.forEach(cap => {
        total += 1;
        niveis.add(1);
        if (cap.filhos) {
            cap.filhos.forEach(filho => {
                total += 1;
                niveis.add(2);
                if (filho.filhos) {
                    filho.filhos.forEach(sub => {
                        total += 1;
                        niveis.add(3);
                    });
                }
            });
        }
    });

    document.getElementById('totalRegistros').textContent = total;
    document.getElementById('totalNiveis').textContent = niveis.size;
    document.getElementById('ultimaAtualizacao').textContent = new Date().toLocaleTimeString('pt-BR');
}

// ===== EXPANDIR TODOS =====
function expandirTodos() {
    document.querySelectorAll('.tree-children').forEach(el => {
        el.classList.add('open');
    });
    document.querySelectorAll('.tree-item .toggle').forEach(el => {
        if (el.classList.contains('invisible')) return;
        el.classList.add('open');
    });
}

// ===== COLAPSAR TODOS =====
function colapsarTodos() {
    document.querySelectorAll('.tree-children').forEach(el => {
        el.classList.remove('open');
    });
    document.querySelectorAll('.tree-item .toggle').forEach(el => {
        if (el.classList.contains('invisible')) return;
        el.classList.remove('open');
    });
}

// ===== TE CLA DE ATALHO (Ctrl+Shift+F para buscar) =====
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
        document.getElementById('searchInput').select();
    }
    if (e.key === 'Escape') {
        document.getElementById('searchInput').blur();
    }
});

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    carregarComponente('b', document.querySelector('.tab-btn'));
});