// Vetores
var Entrada = [];
var Grupos = [[]];
var Tabela = [];
var Auxiliar = 0;

// Limpa o campo de busca
function limparCampo() {
	$("#buscar.form-control").val("");
}
// Troca de cor a barra de busca confome o estado
function caracterRejeitado() {
	$('#box').addClass('rejeitado');
	$('#box').removeClass('reconhecido');
}
function caracterReconhecido() {
	$('#box').addClass('reconhecido');
	$('#box').removeClass('rejeitado');
}

// Pinta a célula da letra buscada
function PintaLinha(grupo, caracter) {
	$('#automato tr').removeClass('grupo_selecionado');
	$('#automato td').removeClass('caracter_selecionado');
	$('#automato .estado_' + grupo).addClass('grupo_selecionado');
	$('#automato .letra_' + caracter).addClass('caracter_selecionado');
}

// Remove caracteres especiais
function verificaCaracter() {
	var primeiro = 'a';
	var ultimo = 'z';
	var token = $("#input-insere").val();

	// Verifica letra por letra se está no alfabeto básico minúsculo
	if (token.slice(-1) == " " || !(token.slice(-1).charCodeAt(0) >= primeiro.slice(-1).charCodeAt(0) && token.slice(-1).charCodeAt(0) <= ultimo.slice(-1).charCodeAt(0))) {
		$("#input-insere").val(token.replace(token.slice(-1), ''));
	}
}

// Cadastra palavra
function gravaPalavra() {
	var token = $("#input-insere").val();
	// Verificação
	if (token) {
		// Verifica se já foi cadastrada
		if (Entrada.indexOf(token) < 0 && token.length > 0) {
			$("#table-palavras").append("<tr class=tk-" + token + "><td>" + token + "</td><td><span class='badge badge-danger badge-icon' onclick=\"apagaPalavra('" + token + "')\"><i class='fa fa-times' aria-hidden='true'></i></span></td></tr>")
			Entrada.push(token);
			$("#input-insere").val("");
		}
		// Emite alerta se já está cadastrada
		else {
			alert("Palavra já cadastrada");
			$("#input-insere").val("");
		}
	}

	verificaGrupos();
	Tabela = criaLinhas();
	enviaTabela(Tabela);

	// Verifica a palavra buscada
	$('#buscar').keyup(function (e) {
		if (Tabela.length > 0) {
			verificaPalavra(e);
		}
	});
}


// Remove a palavra gravada
function apagaPalavra(token) {
	var index = Entrada.indexOf(token);
	if (index >= 0 && token.length > 0) {
		Entrada.splice(index, 1);
		$(".tk-" + token).hide();
	}

	// Remove os registros da tabela
	$("#automato").html("");
	Grupos = [[]];
	Auxiliar = 0;
	Tabela = [];
	verificaGrupos();
	Tabela = criaLinhas();
	enviaTabela(Tabela);
}

// Cria os grupos com a palavra digitada
function verificaGrupos() {
	for (var i = 0; i < Entrada.length; i++) {
		var estado_atual = 0;
		var palavra_vetor = Entrada[i];
		for (var j = 0; j < palavra_vetor.length; j++) {
			if (typeof Grupos[estado_atual][palavra_vetor[j]] === 'undefined') {
				var proximo_estado = Auxiliar + 1;
				Grupos[estado_atual][palavra_vetor[j]] = proximo_estado;
				Grupos[proximo_estado] = [];
				Auxiliar = estado_atual = proximo_estado;
			} else {
				estado_atual = Grupos[estado_atual][palavra_vetor[j]];
			}
			console.log(Grupos);
			// Verifica se chegou ao final do vetor
			if (j == palavra_vetor.length - 1) {
				Grupos[estado_atual]['final'] = true;
			}
		};
	};
}

// Cria as linhas da tabela
function criaLinhas() {
	var vetor_grupos = [];
	for (var i = 0; i < Grupos.length; i++) {
		var aux = [];
		aux['estado'] = i;
		var primeiro = 'a';
		var ultimo = 'z';
		for (var j = primeiro.charCodeAt(0); j <= ultimo.charCodeAt(0); j++) {
			var letra = String.fromCharCode(j);
			if (typeof Grupos[i][letra] === 'undefined') {
				aux[letra] = '-'
			} else {
				aux[letra] = Grupos[i][letra]
			}
		}
		// Cria um indicador que a letra é final
		if (typeof Grupos[i]['final'] !== 'undefined') {
			aux['final'] = true;
		}
		vetor_grupos.push(aux);
	};
	return vetor_grupos;
}

// Popula a tabela
function enviaTabela(vetor_grupos) {
	tabela = $('#automato');
	tabela.html('');
	// Cria as celulas do cabeçalho
	var tr = $(document.createElement('tr'));
	var th = $(document.createElement('th'));
	// Nomeia a coluna como 'Estado'
	th.html('Estado');
	tr.append(th);
	var primeiro = 'a';
	var ultimo = 'z';
	// Inserir as letras no cabeçalho
	for (var j = primeiro.charCodeAt(0); j <= ultimo.charCodeAt(0); j++) { // Adiciona todas as letras no cabeçalho da tabela
		var th = $(document.createElement('th'));
		th.html(String.fromCharCode(j));
		tr.append(th);
	}
	tabela.append(tr);

	// Cria as células da tabela
	for (var i = 0; i < vetor_grupos.length; i++) {
		// Adiciona linha
		var tr = $(document.createElement('tr'));
		// Adiciona célula
		var td = $(document.createElement('td'));
		// Se o indicador fio final adiciona um *
		if (vetor_grupos[i]['final']) {
			td.html('q' + vetor_grupos[i]['estado'] + '*');
		} else {
			td.html('q' + vetor_grupos[i]['estado']);
		}
		tr.append(td);
		// Cria uma tabla de grupo e letra
		tr.addClass('estado_' + vetor_grupos[i]['estado']);
		var primeiro = 'a';
		var ultimo = 'z';
		for (var j = primeiro.charCodeAt(0); j <= ultimo.charCodeAt(0); j++) {
			var letra = String.fromCharCode(j);
			var td = $(document.createElement('td'));
			td.addClass('letra_' + letra);
			// Adiciona 'q' onde não tem valor numérico
			if (vetor_grupos[i][letra] != '-') {
				td.html('q' + vetor_grupos[i][letra]);
			}
			tr.append(td);
		}
		tabela.append(tr);
	}
}

// Verifica os caracteres da palavra a ser buscada
function verificaPalavra(event) {
	var primeiro = 'a';
	var ultimo = 'z';
	// Busca o valor do campo
	var palavras = $('#buscar').val();
	// Se o campo é vazio, as cores são limpadas
	if (palavras.length == 0) {
		$('#box').removeClass('reconhecido');
		$('#box').removeClass('rejeitado');
		$('#automato tr').removeClass('grupo_selecionado');
		$('#automato td').removeClass('caracter_selecionado');
	}
	// Começa verificando o estado 0
	var estado = 0;
	var rejeitado = false;
	for (var i = 0; i < palavras.length; i++) {
		// Verifica letra por letra se está no alfabeto básico minúsculo
		if (palavras[i].charCodeAt(0) >= primeiro.charCodeAt(0) && palavras[i].charCodeAt(0) <= ultimo.charCodeAt(0) && rejeitado == false) {
			// Pinta a linha e a célula da letra
			PintaLinha(estado, palavras[i]);
			// Se o estado não for '-', é aceito
			if (Tabela[estado][palavras[i]] != '-') {
				estado = Tabela[estado][palavras[i]];
				caracterReconhecido();
				// Caso for um estado vaziu ele emite rejeitado
			} else {
				caracterRejeitado();
				rejeitado = true;
			}

			// Após digitar o espaço
		} else if (palavras[i] == ' ') {
			if (rejeitado == false) {
				if (Tabela[estado]['final']) {
					// Se for final, é dado como Reconhecido
					$("#table-search").append("<tr><td>" + palavras + "</td><td><span><span>Reconhecido</span></span></td></tr>")
				} else {
					// Se não for final, é reconhecido, mas dado como Não Final
					$("#table-search").append("<tr><td>" + palavras + "</td><td><span><span>Não Final</span></span></td></tr>")
				}
			} else {
				// Se não foi reconhecido, é dado como Rejeitado
				$("#table-search").append("<tr><td>" + palavras + "</td><td><span><span>Rejeitado</span></span></td></tr>")
			}
			// Limpa as cores da tabela
			$('#box').removeClass('reconhecido');
			$('#box').removeClass('rejeitado');
			$('#automato tr').removeClass('grupo_selecionado');
			$('#automato td').removeClass('caracter_selecionado');
			$('#buscar').val("");
		} else if (rejeitado == false) {
			// Se buscar por um caracter fora do alfabeto setado, muda para cores de rejeitado, e emite um alerta
			caracterRejeitado();
			alert('Caracter inválido: ' + palavras[i]);
		}
	};
}