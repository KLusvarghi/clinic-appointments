export const formatCurrencyInCents = (amount: number) => {
  // o "Intl" é de internacionalização
  // o "pt-BR" é o idioma
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", // style é o tipo de moeda
    currency: "BRL", // currency é o tipo da moeda, que é o "R$"
  }).format(amount / 100); // e no fim nós dividimos por 100 por que recebemos o valor em centavos
};
