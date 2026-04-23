(() => {
  const adicionaisGratisOpcoes = ['Leite em pó', 'Granola', 'Leite condensado', 'Paçoca', 'Banana', 'Confete', 'Cereal', 'Flocos Crocantes'];
  const adicionaisBatidaGratis = ['Leite em pó', 'Paçoca', 'Morango', /*'Creme de Nutella'*/, 'Creme de Morango', 'Creme de Maracujá', /*'Kiwi', 'Abacaxi', 'Manga'*/];
  const adicionaisPagosTradicionais = [
    { nome: 'Morango', preco: 3.00 },
    { nome: 'Nutella', preco: 4.00 },
    { nome: 'Bis', preco: 2.00 },
    { nome: 'Ovomaltine', preco: 4.00 },
    { nome: 'Creme de Ninho', preco: 3.00 },
    { nome: 'Creme de Morango', preco: 3.00 },
    { nome: 'Creme de Maracujá', preco: 3.00 },
   // { nome: 'Kiwi', preco: 4.00 },
    //{ nome: 'Abacaxi', preco: 3.00 },
    //{ nome: 'Manga', preco: 2.00 }
  ];

  const opcoesTamanhos = [
    { tamanho: 'Copo de Açaí de 300ml', preco: 14.00 },
    { tamanho: 'Copo de Açaí de 500ml', preco: 17.00 },
    { tamanho: 'Copo de Açaí de 700ml', preco: 23.00 },
    { tamanho: 'Batida 300ml', preco: 18.00 },
    { tamanho: 'Batida 500ml', preco: 21.00 }
  ];

  let copos = [];

  const modalElement = document.getElementById('pedidoModal');
  const abasContainer = document.getElementById('abasAcai');
  const conteudoAbas = document.getElementById('conteudoAbas');
  const enderecoInput = document.getElementById('endereco');
  const pagamentoSelect = document.getElementById('pagamento');
  const totalPedidoEl = document.getElementById('totalPedido');
  const btnAdicionarCopo = document.getElementById('btnAdicionarCopo');
  const btnFinalizarPedido = document.getElementById('btnEnviarPedido');

  function criarAba(copo, index) {
    const aba = document.createElement('li');
    aba.className = 'nav-item position-relative me-2';

    const botao = document.createElement('button');
    botao.className = 'nav-link pe-4' + (index === 0 ? ' active' : '');
    botao.id = `tab-${index}`;
    botao.dataset.bsToggle = 'tab';
    botao.dataset.bsTarget = `#tab-pane-${index}`;
    botao.type = 'button';
    botao.role = 'tab';
    botao.setAttribute('aria-controls', `tab-pane-${index}`);
    botao.setAttribute('aria-selected', index === 0);
    botao.textContent = `Copo ${index + 1} - ${copo.tamanho}`;
    aba.appendChild(botao);

    if (copos.length > 1) {
      const btnFechar = document.createElement('button');
      btnFechar.type = 'button';
      btnFechar.innerHTML = '&times;';
      btnFechar.className = 'btn-close btn-close-white position-absolute top-50 end-0 translate-middle-y me-1';
      btnFechar.style.fontSize = '0.7rem';
      btnFechar.addEventListener('click', (e) => {
        e.stopPropagation();
        copos.splice(index, 1);
        abrirModal();
        const abas = abasContainer.querySelectorAll('button.nav-link');
        if (abas.length > 0) {
          const ativar = index > 0 ? index - 1 : 0;
          new bootstrap.Tab(abas[ativar]).show();
        }
      });
      aba.appendChild(btnFechar);
    }

    abasContainer.appendChild(aba);
  }

  function criarConteudoAba(copo, index) {
    const conteudo = document.createElement('div');
    conteudo.className = 'tab-pane fade' + (index === 0 ? ' show active' : '');
    conteudo.id = `tab-pane-${index}`;
    conteudo.role = 'tabpanel';

    const isBatida = copo.tamanho.includes('Batida');

    const labelTamanho = document.createElement('label');
    labelTamanho.textContent = 'Tamanho do copo:';
    conteudo.appendChild(labelTamanho);

    const selectTamanho = document.createElement('select');
    selectTamanho.className = 'form-select mb-3';
    selectTamanho.id = `tamanho-copo-${index}`;

    opcoesTamanhos.forEach(op => {
      const option = document.createElement('option');
      option.value = JSON.stringify(op);
      option.textContent = `${op.tamanho} - R$ ${op.preco.toFixed(2)}`;
      if (op.tamanho === copo.tamanho) option.selected = true;
      selectTamanho.appendChild(option);
    });

    selectTamanho.addEventListener('change', () => {
      const { tamanho, preco } = JSON.parse(selectTamanho.value);
      copo.tamanho = tamanho;
      copo.precoBase = preco;
      copo.batidaTipo = 'Água';
      copo.adicionaisGratis = [];
      copo.adicionaisPagos = [];
      abrirModal();
    });

    conteudo.appendChild(selectTamanho);

    const adicionaisGratis = isBatida ? adicionaisBatidaGratis : adicionaisGratisOpcoes;
    const maxGratis = isBatida ? 3 : 4;

    if (isBatida) {
      const labelBatida = document.createElement('label');
      labelBatida.textContent = 'A batida será com:';
      conteudo.appendChild(labelBatida);

      const divBatida = document.createElement('div');
      divBatida.className = 'adicionais-gratis mb-3';

      ['Água', 'Leite'].forEach(opcao => {
        const label = document.createElement('label');
        label.style.marginRight = '10px';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `batida-${index}`;
        radio.value = opcao;
        radio.checked = (copo.batidaTipo || 'Água') === opcao;

        radio.addEventListener('change', () => {
          copo.batidaTipo = opcao;
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(opcao));
        divBatida.appendChild(label);
      });

      conteudo.appendChild(divBatida);
    }

    const labelGratis = document.createElement('label');
    labelGratis.textContent = `Escolha até ${maxGratis} adicionais grátis:`;
    conteudo.appendChild(labelGratis);

    const divGratis = document.createElement('div');
    divGratis.className = 'adicionais-gratis';

    adicionaisGratis.forEach(nome => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = nome;
      checkbox.checked = copo.adicionaisGratis.includes(nome);

      checkbox.addEventListener('change', () => {
        const selecionados = Array.from(divGratis.querySelectorAll('input:checked'));
        if (selecionados.length > maxGratis) {
          checkbox.checked = false;
          alert(`Você só pode escolher até ${maxGratis} adicionais grátis.`);
        }
        copo.adicionaisGratis = Array.from(divGratis.querySelectorAll('input:checked')).map(cb => cb.value);
        atualizarTotal();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(nome));
      divGratis.appendChild(label);
    });

    conteudo.appendChild(divGratis);

    if (!isBatida) {
      const labelPagos = document.createElement('label');
      labelPagos.textContent = 'Adicionais pagos:';
      conteudo.appendChild(labelPagos);

      const divPagos = document.createElement('div');
      divPagos.className = 'adicionais-pagos';

      adicionaisPagosTradicionais.forEach(({ nome, preco }) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = nome;
        checkbox.checked = copo.adicionaisPagos.includes(nome);

        checkbox.addEventListener('change', () => {
          copo.adicionaisPagos = Array.from(divPagos.querySelectorAll('input:checked')).map(cb => cb.value);
          atualizarTotal();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${nome} (+R$ ${preco.toFixed(2)})`));
        divPagos.appendChild(label);
      });

      conteudo.appendChild(divPagos);
    }

    conteudoAbas.appendChild(conteudo);
  }

  function atualizarTotal() {
    const total = copos.reduce((soma, copo) => {
      let valor = copo.precoBase;
      if (!copo.tamanho.includes('Batida')) {
        copo.adicionaisPagos.forEach(nome => {
          const adicional = adicionaisPagosTradicionais.find(a => a.nome === nome);
          if (adicional) valor += adicional.preco;
        });
      }
      return soma + valor;
    }, 0);
    totalPedidoEl.textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  function abrirModal() {
    abasContainer.innerHTML = '';
    conteudoAbas.innerHTML = '';
    copos.forEach((copo, index) => {
      criarAba(copo, index);
      criarConteudoAba(copo, index);
    });

    let removerBtn = document.getElementById('removerCopoManual');
    if (!removerBtn) {
      removerBtn = document.createElement('button');
      removerBtn.id = 'removerCopoManual';
      removerBtn.className = 'btn btn-outline-danger btn-sm float-end mb-2';
      removerBtn.innerHTML = '<i class="bi bi-x"></i> Remover copo';
      enderecoInput.parentElement.insertBefore(removerBtn, enderecoInput);

      removerBtn.addEventListener('click', () => {
        if (copos.length < 2) return alert('Você só tem um copo no pedido.');
        copos.pop();
        abrirModal();
      });
    }
    removerBtn.style.display = copos.length > 1 ? 'block' : 'none';

    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) {
      modalInstance = new bootstrap.Modal(modalElement);
    }
    modalInstance.show();

    atualizarTotal();
  }

  document.querySelectorAll('.fazer-pedido').forEach(card => {
    function adicionarCopo() {
      const tamanho = card.getAttribute('data-tamanho');
      const preco = parseFloat(card.getAttribute('data-preco'));
      const copo = {
        tamanho,
        precoBase: preco,
        adicionaisGratis: [],
        adicionaisPagos: [],
      };
      if (tamanho.includes('Batida')) copo.batidaTipo = 'Água';
      copos.push(copo);
      abrirModal();
    }
    card.addEventListener('click', adicionarCopo);
    card.addEventListener('keydown', e => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        adicionarCopo();
      }
    });
  });

  btnAdicionarCopo.addEventListener('click', () => {
    if (!copos.length) return;
    const ultimo = copos[copos.length - 1];
    const novo = {
      tamanho: ultimo.tamanho,
      precoBase: ultimo.precoBase,
      adicionaisGratis: [],
      adicionaisPagos: [],
    };
    if (ultimo.tamanho.includes('Batida')) novo.batidaTipo = 'Água';
    copos.push(novo);
    abrirModal();
  });

  btnFinalizarPedido.addEventListener('click', () => {
    if (!copos.length) return alert('Você precisa adicionar pelo menos um copo.');
    if (!enderecoInput.value.trim()) {
      alert('Informe o endereço de entrega.');
      enderecoInput.focus();
      return;
    }
    if (!pagamentoSelect.value) {
      alert('Selecione a forma de pagamento.');
      pagamentoSelect.focus();
      return;
    }

    let textoPedido = `*Pedido de Açaí RoxOut Chat*\n\n`;
    copos.forEach((copo, i) => {
      textoPedido += `Copo ${i + 1} - ${copo.tamanho}\n`;
      if (copo.tamanho.includes('Batida')) {
        textoPedido += `Com: ${copo.batidaTipo || 'Água'}\n`;
      }
      if (copo.adicionaisGratis.length)
        textoPedido += `Grátis: ${copo.adicionaisGratis.join(', ')}\n`;
      if (copo.adicionaisPagos.length)
        textoPedido += `Pagos: ${copo.adicionaisPagos.join(', ')}\n`;
      textoPedido += '\n';
    });

    textoPedido += `Endereço: ${enderecoInput.value}\n`;
    textoPedido += `Pagamento: ${pagamentoSelect.value}\n`;

    const total = copos.reduce((sum, copo) => {
      let valor = copo.precoBase;
      if (!copo.tamanho.includes('Batida')) {
        copo.adicionaisPagos.forEach(nome => {
          const adicional = adicionaisPagosTradicionais.find(a => a.nome === nome);
          if (adicional) valor += adicional.preco;
        });
      }
      return sum + valor;
    }, 0);

    textoPedido += `Total: R$ ${total.toFixed(2)}\n\n`;

    const telefone = '559999999999'; // Substitua pelo número real da loja
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(textoPedido)}`;
    window.open(url, '_blank');
  });

  modalElement.addEventListener('hidden.bs.modal', () => {
    copos = [];
    abasContainer.innerHTML = '';
    conteudoAbas.innerHTML = '';
    enderecoInput.value = '';
    pagamentoSelect.selectedIndex = 0;
    totalPedidoEl.textContent = 'Total do Pedido: R$ 0,00';
  });
})();
