# O que mudou entre o design e o site publicado

> **Para a Nina.** Tudo o que fizemos em cima do seu export desde 10 de setembro de 2026, com o
> motivo de cada mudança, para você refletir no `.fig` e para todo mundo trabalhar sobre a mesma
> versão. Edição em inglês: [DESIGN-CHANGES.md](DESIGN-CHANGES.md).

O site está no ar em [datacaddy.co](https://datacaddy.co) desde 11 de setembro. O seu desenho é a
referência visual — o que está aqui são ajustes técnicos, estados que o desenho ainda não previa, e
uma correção nossa que acabou desfeita porque você estava certa.

## Começando pelo erro que era nosso

**A seção final (a chamada com o formulário) tinha sido remontada por nós, e voltou ao seu
original.** Em 12 de setembro colocamos o formulário ao lado do texto, numa grade de duas colunas
que não existe no seu arquivo. A grade ficou com um filho só, a segunda coluna nasceu vazia, e o
conteúdo passou a ocupar o que sobrava.

O efeito não era óbvio na tela, mas é mensurável: a largura do texto passou a variar entre **587 e
942 px** conforme a janela, contra os **640 px constantes** que você tinha definido. Ou seja, um
título que você ajustou para quebrar em 640 estava quebrando em larguras que você nunca viu. O
desequilíbrio que o Yukio notou vinha daí.

Em 13 de setembro comparamos o seu export com o nosso, regra por regra. **Foi o único lugar em que
tínhamos inventado layout em vez de portar o seu.** A seção voltou ao seu original — mesmo
contêiner, mesmos espaçamentos, mesma ordem — e as duas classes que só existiam do nosso lado foram
apagadas. Hoje toda classe do arquivo é sua.

Sobrou uma diferença nessa seção, e é proposital: **o gradiente sobre a foto termina em 0,74 em vez
de 0,55.** Com 0,55 o lado direito ficava claro demais e os rótulos do formulário perdiam
legibilidade justamente onde os campos ficam. Se preferir resolver isso de outro jeito no desenho,
a gente troca.

## Estados que o desenho ainda não tem

São comportamentos novos, não redesenhos. Vale você decidir como quer que apareçam.

**O botão de envio começa apagado.** Só acende quando **nome, e-mail e empresa** estiverem
preenchidos e o e-mail parecer válido — a mensagem continua opcional. Abaixo do botão há uma linha
dizendo o que ainda falta.

Ele fica apagado, mas continua clicável de propósito: um botão realmente desativado some da
navegação por teclado, e quem usa leitor de tela encontra um controle que não responde e não
explica nada. Assim, quem apertar recebe a marcação dos campos que faltam e o cursor vai para o
primeiro.

**Os campos mostram erro ao sair, não enquanto a pessoa digita.** Nada fica vermelho na primeira
letra.

**Os quatro botões de destino apagam conforme o banco escolhido.** Nem toda nuvem oferece todo
banco como serviço gerenciado:

| Banco escolhido | aws | azure | oci | gcp |
|---|---|---|---|---|
| Oracle | ✓ | apagado | ✓ | apagado |
| SQL Server | ✓ | ✓ | apagado | ✓ |
| PostgreSQL | ✓ | ✓ | ✓ | ✓ |
| MySQL | ✓ | ✓ | ✓ | ✓ |

Também apagados, também clicáveis: clicar em um deles abre um cartão explicando o que aquela nuvem
oferece no lugar. A Oracle Cloud, por exemplo, não tem SQL Server gerenciado — lá ele roda em
máquinas que o próprio cliente administra, com licença própria. É um modelo de operação diferente,
não uma opção mais barata.

**Há um aviso em amarelo sob a calculadora quando a Oracle Cloud está selecionada.** Os preços das
outras três nuvens vêm de tabelas públicas; os da Oracle não puderam ser confirmados, então a
coluna diz que é estimativa. É um elemento novo na seção — hoje é só uma frase, mas se quiser dar
uma forma a ele, é seu.

**Uma linha de consentimento LGPD ao lado do botão**, com um link que abre a política em uma janela
sobre a página. Não muda a estrutura da seção.

## Ajustes técnicos que não mudam a aparência

**As fontes.** O export declarava `'Archivo:Regular'` e `'Archivo:SemiBold'` — nomes que o Figma
gera e que não correspondem a nenhuma fonte instalada, então o navegador caía em uma fonte
qualquer. Hoje é a **Archivo variável de verdade**, hospedada com o site, com os dois eixos que o
seu desenho usa (peso e largura — o `wdth 125` dos títulos funciona). A **Fraunces** saiu: só
estava referenciada em código que não era usado.

**As imagens foram reprocessadas: 3,27 MB → 250 KB, visualmente idênticas.** A textura do topo
sozinha saiu de 2,23 MB para 28,5 KB — ela é aplicada em `screen` sobre preto, e nesse modo os três
canais de cor são redundantes, então virou tons de cinza sem diferença perceptível (medimos o pior
caso em 2,83 de 255). Nenhum CSS mudou.

**Os ícones e o card social que você entregou em 10 de setembro entraram como estão.** Estavam
todos no tamanho certo e sem transparência — o de 180×180 em especial, que importa porque o iOS
compõe transparência sobre preto. Nada foi reprocessado.

**O endereço de contato.** O export original trazia três endereços diferentes em lugares
diferentes: `hello@datacaddy.com` (duas vezes) e `contato@datacaddy.com.br`. Hoje é um só,
**`info@datacaddy.co`**, que funciona nos dois idiomas.

**O "Sign in".** No export de 11 de setembro ele apontava para um endereço IP sem `https`. Ficou
fora do ar público até 13 de setembro, quando o certificado ficou pronto; hoje aponta para
**`https://app.datacaddy.co/`** e está visível no menu e na gaveta do celular.

**O formulário agora envia de verdade.** O do export mostrava "recebemos sua mensagem" sem ter para
onde mandar — não havia nada atrás do botão. Mantivemos o seu desenho e os seus rótulos, que são
melhores que os nossos, sobre uma entrega que funciona.

**O rodapé nomeia a ASO Tech Global LLC** e deixa uma folga embaixo para o selo da Netlify, que o
plano gratuito exibe.

## Duas línguas, e o seu português é o original

O site publica **inglês em `/` e português em `/pt-br/`**, do mesmo desenho. Vale registrar de onde
veio o português: ele estava dentro do export, em um arquivo que parecia código gerado descartável.
Era o texto original. Se tivéssemos limpado o projeto antes de ler, teríamos apagado a versão
autoral e retraduzido do inglês.

Por isso o português é tratado como original e o inglês como derivado — inclusive no vocabulário de
golfe, que é transcriado e não traduzido.

Uma correção nessa linha: **"Park Card" está errado em inglês.** É uma tradução literal de *cartão
do parque*, e *parque* aqui é o parque de máquinas, não um parque público. Em inglês ficou
*scorecard*. Se isso estiver em algum artboard em inglês, vale corrigir lá também.

## Coisas que queremos decidir com você

**O "E" da coluna de score.** É *even par*, e veio do seu original em português. A dúvida é
honesta: quem não joga golfe não lê nada nele, nos dois idiomas. Manter, trocar por um número, ou
acompanhar de uma legenda?

**O card social em português.** Hoje os dois idiomas usam o card em inglês. Se o português for o
idioma que fica na raiz do site, vale ter um próprio. A decisão de qual idioma fica na raiz é do
lançamento, então isso pode esperar — mas é você quem faz.

**Uma cópia local do `.fig`.** O plano Starter guarda histórico de **30 dias**. Passado esse prazo
não há como voltar atrás, e não existe cópia fora da sua conta. `Arquivo → Salvar cópia local`
resolve, e vale repetir a cada entrega. O `site.fig` que está na pasta de handover tem 32 KB — é um
atalho, não o arquivo.

**O limite de 3 páginas por arquivo** é o teto que este projeto encostaria primeiro, se o desenho
crescer. Não é problema hoje; é só para você saber que a gente sabe.

## O que não mexemos

Vale dizer o que ficou como estava, porque é a maior parte:

- **Toda classe de estilo da página é sua.** A comparação de 13 de setembro achou três regras
  diferentes entre os dois arquivos, e as três diferiam só na fonte — pelo motivo da seção acima.
- **A escala de larguras é a sua**, exatamente: 520, 640, 640, 700, 700, 720, 760, 1180.
- **A estrutura da calculadora é a sua**, inclusive a forma de organizar as quatro nuvens, que é
  melhor que a que a gente tinha antes. Só trocamos a etiqueta por um código interno por baixo,
  para que reescrever o nome de um botão não troque a nuvem que ele calcula.
- **`.dc-cta-btns` continua no arquivo mesmo sem ninguém usar.** Está morta no seu arquivo também —
  você a deixou lá quando trocou os botões pelo formulário. Seguir o seu desenho é seguir o
  arquivo, não arrumá-lo.

## Onde ver

O site publicado é [datacaddy.co](https://datacaddy.co). O português está em
[datacaddy.co/pt-br/](https://datacaddy.co/pt-br/).

Uma observação: o site ainda pede aos buscadores para **não** indexá-lo. Isso é proposital e cai no
lançamento. Até lá, o endereço funciona normalmente para quem tem o link.
