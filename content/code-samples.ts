// Trechos ILUSTRATIVOS e genéricos — nenhuma tabela, regra ou dado real da empresa.

export const sqlCommission = `-- Comissão escalonada por atingimento de meta
WITH vendas AS (
  SELECT v.vendedor_id,
         SUM(i.valor_liquido)                AS faturado,
         m.valor_meta
  FROM   dbo.pedido_item i
  JOIN   dbo.pedido      v ON v.pedido_id   = i.pedido_id
  JOIN   dbo.meta_mensal m ON m.vendedor_id = v.vendedor_id
                          AND m.competencia = @competencia
  WHERE  v.status = 'FATURADO'
  GROUP  BY v.vendedor_id, m.valor_meta
), faixas AS (
  SELECT vendedor_id, faturado,
         faturado / NULLIF(valor_meta, 0)    AS atingimento,
         RANK() OVER (ORDER BY faturado DESC) AS ranking
  FROM   vendas
)
SELECT f.vendedor_id, f.faturado, f.atingimento, f.ranking,
       f.faturado * r.percentual             AS comissao
FROM   faixas f
CROSS  APPLY (
  SELECT TOP (1) percentual
  FROM   dbo.regra_comissao
  WHERE  f.atingimento >= faixa_minima
  ORDER  BY faixa_minima DESC
) r;`;

export const javaActionButton = `public class LiberarPedido implements AcaoRotinaJava {

  @Override
  public void doAction(ContextoAcao ctx) throws Exception {
    for (Registro linha : ctx.getLinhas()) {
      BigDecimal nroPedido = (BigDecimal) linha.getCampo("NUNOTA");

      if (!regraDeCreditoOk(nroPedido)) {
        ctx.mostraErro("Pedido " + nroPedido + " sem limite de crédito.");
        return;
      }
      linha.setCampo("STATUS_LIBERACAO", "L");
      linha.save();
    }
    ctx.setMensagemRetorno("Pedidos liberados com sucesso.");
  }
}`;

export const apexTrigger = `trigger TaxaFinanciamento on Opportunity (before insert, before update) {
  Map<Integer, Decimal> taxaPorPrazo = TabelaFinanciamento.carregar();

  for (Opportunity opp : Trigger.new) {
    if (opp.Parcelas__c == null || opp.Amount == null) continue;

    Decimal taxa = taxaPorPrazo.get(Integer.valueOf(opp.Parcelas__c));
    opp.Taxa_Financiamento__c = taxa;
    opp.Valor_Financiado__c   = opp.Amount * (1 + taxa / 100);
  }
}`;

export const mql5Crossover = `int OnInit() {
  hFast = iMA(_Symbol, _Period, 9,  0, MODE_EMA, PRICE_CLOSE);
  hSlow = iMA(_Symbol, _Period, 21, 0, MODE_EMA, PRICE_CLOSE);
  return(INIT_SUCCEEDED);
}

void OnTick() {
  double fast[2], slow[2];
  CopyBuffer(hFast, 0, 1, 2, fast);
  CopyBuffer(hSlow, 0, 1, 2, slow);

  bool cruzouPraCima  = fast[0] <= slow[0] && fast[1] > slow[1];
  bool cruzouPraBaixo = fast[0] >= slow[0] && fast[1] < slow[1];

  if (cruzouPraCima  && !PositionSelect(_Symbol)) trade.Buy(Lote(), _Symbol, 0, Stop(), Alvo());
  if (cruzouPraBaixo &&  PositionSelect(_Symbol)) trade.PositionClose(_Symbol);
}`;
