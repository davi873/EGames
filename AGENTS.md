EGames
1. Objetivo
Aplicativo web interativo para crianças, com foco no aprendizado de letras e números, que reage visualmente e com animações divertidas à digitação no teclado ou clique nas teclas na tela.
Inclui:

Modo Livre: estimula a digitação espontânea com feedback visual.

Modo Desafio (Treino de Palavra): incentiva a digitar palavras específicas letra por letra até completá-las.

Animações de super-heróis: gatilhos que mostram imagens temáticas quando palavras-chave são digitadas.

2. Funcionalidades Principais
A) Modo Livre
Exibe a última tecla digitada (letra ou número) em destaque no centro da tela.

Move a tecla anterior para um “mural” espalhado pela tela (até 10 últimas letras/números).

Reconhece palavras-gatilho (HULK, THOR, BATMAN) — ao detectá-las no fluxo digitado, exibe animação com imagem local do herói.

B) Modo Desafio
Ativado via botão “Modo Desafio”.

Possui opção para mostrar/ocultar campo de definição da palavra-alvo.

Apresenta a próxima letra a ser digitada.

Se a letra correta é digitada:

Atualiza o centro da tela com a letra.

Avança para a próxima letra da palavra.

Ao concluir a palavra:

Exibe animação com imagem de herói.

Retorna automaticamente ao Modo Livre.

C) Animações de Heróis
Cada palavra-gatilho está vinculada a um arquivo de imagem local:

public/heroes/hulk.png

public/heroes/thor.png

public/heroes/batman.png

A imagem surge no centro com efeito:

Entrada: aumenta e ganha opacidade.

Flutuação: leve movimento vertical e rotação.

Saída: desaparece e reduz de tamanho.

D) Interatividade
Funciona com teclado físico ou teclado virtual na tela.

Letras e números válidos: A–Z e 0–9.

Máximo de 10 letras/números no mural.

Posição no mural: esquerda para direita com altura aleatória.

3. Requisitos Técnicos
Frontend
Framework: React 18+

Animações: framer-motion

Estilo: Tailwind CSS (classes utilitárias)

4. Fluxo de Uso
Início: por padrão está no Modo Livre.

Usuário digita ou clica numa letra/número:

Letra aparece no centro.

Letra anterior vai para mural (até 10).

Buffer de últimas letras verifica se contém palavra-gatilho.

Se palavra-gatilho detectada → animação de herói.

Ao alternar para Modo Desafio:

Se mostrar campo, digita a palavra-alvo.

Digita-se letra por letra até completar.

Ao concluir → animação e volta ao Modo Livre.